const { Log } = require("../model/Log");
const { RecommendPoints } = require("../model/RecommendPoints");
const { WatchedVideo } = require("../model/WatchedVideo");
const videoService = require("./videoService");
const collectionUtils = require("../utils/CollectionUtils");
let suggestionPointsMatrix = [];
let baseReactionPointsMatrix = [];
let pathWithWeightBetweenUsersMatrix = [];
let similarityMatrix = [];
let pathMatrix = [];
let users = [];
let videos = [];
let points = [];

function transposeMatrix(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function multiplyMatrices(matrixA, matrixB) {
    const result = Array(matrixA.length).fill(null).map(() => Array(matrixB[0].length).fill(0));

    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixB[0].length; j++) {
            for (let k = 0; k < matrixA[0].length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}

function convertElementsToFixedWidth(matrix) {
  return matrix.map(row =>
    row.map(value => value.toFixed(5))
  );
}

function findMaxIn2DArray(matrix) {
    let max = -Infinity; // Start with the smallest possible value
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) {
                max = matrix[i][j];
            }
        }
    }
    return max;
}

function normalizeMatrix(matrix) {
  const max = findMaxIn2DArray(matrix);
  if (max === 0) return matrix; // Avoid division by zero
  return matrix.map(row => row.map(value => value / max));
}
const buildBaseReactionPointsMatrix = async () => {
    // Tạo ma trận điểm tương tác người dùng với video
    if (!baseReactionPointsMatrix || baseReactionPointsMatrix.length === 0) {
        const recommendPoints = await RecommendPoints.find();
        recommendPoints.forEach((data) => {
            const user = data.userId;
            const video = data.videoId;
            const point = data.point;
            if (!users.includes(user)) {
                users.push(user);
            }
            if (!videos.includes(video)) {
                videos.push(video);
            }
            points.push([users.indexOf(user), videos.indexOf(video), point]);
        });
        points = Array.from(Array(users.length), () =>
            new Array(videos.length).fill(0)
        );
        recommendPoints.forEach((data) => {
            const user = data.userId;
            const video = data.videoId;
            const point = data.point;
            points[users.indexOf(user)][videos.indexOf(video)] = point;
        });
        baseReactionPointsMatrix = points;

        console.log("=============baseReactionPointsMatrix================");
        console.table(baseReactionPointsMatrix);
        console.log("==============baseReactionPointsMatrix===============");
      baseReactionPointsMatrix = normalizeMatrix(baseReactionPointsMatrix);
      console.log("=============baseReactionPointsMatrix================");
      console.table(convertElementsToFixedWidth(baseReactionPointsMatrix));
      console.log("==============baseReactionPointsMatrix===============");
    }
}

const similarityPoint = (user1Index, user2Index, videoIndex, pointMatrix, maxNumber) => {
    if (user1Index === user2Index) {
        return 0;
    } else {
        return ((maxNumber - Math.abs(pointMatrix[user1Index][videoIndex] - pointMatrix[user2Index][videoIndex])) / maxNumber).toFixed(2);
    }
}

const buildSimilarityMatrix = (pointMatrix) => {
    const maxPoint = findMaxIn2DArray(pointMatrix);
    const numberOfUsers = pointMatrix.length;
    for (let i = 0; i < numberOfUsers; i++) {
        const row = [];
        for (let j = 0; j < numberOfUsers; j++) {
          if (i === j) {
            row.push(1);
          } else {
            row.push(similarityPoint(i, j, 0, pointMatrix, maxPoint));
          }
        }
        similarityMatrix.push(row);
    }
  console.log("=============similarityMatrix================");
  console.table(similarityMatrix);
  console.log("==============similarityMatrix===============");
}

const buildPathMatrix = () => {
    // Tạo ma trận đường đi của các người dùng
    pathMatrix = baseReactionPointsMatrix.map(row =>
        row.map(value => value !== 0 ? 1 : 0)
    );

    console.log("=============pathMatrix================");
    console.table(pathMatrix);
    console.log("==============pathMatrix===============");
}

const buildPathWithWeightBetweenUserMatrix = () => {
    pathWithWeightBetweenUsersMatrix = multiplyMatrices(multiplyMatrices(pathMatrix, transposeMatrix(pathMatrix)), similarityMatrix);
}

/*
        With step = 1, suggestion points matrix is base reaction points matrix
        With step = N > 3, suggestion point matrix =  Path With Weight between user matrix * Suggestion Point Matrix (N-2)
 */
const buildSuggestionPointsMatrix = (step) => {
    let result;
    if (step === 1) {
        result = baseReactionPointsMatrix;
    } else if (step >= 3) {
        result = multiplyMatrices(pathWithWeightBetweenUsersMatrix, buildSuggestionPointsMatrix(step - 2));
    }

    return result;
}

/*
    For user i, the recommendation points for videos is Suggestion Point Matrix [i]
    With list of recommendation points for videos, we sort with descending order, then get first N videos.
 */
const getRecommendedVideosList = async (userId, page, pageSize) => {
    if (!suggestionPointsMatrix || suggestionPointsMatrix.length === 0) {
      await initMatrix();
    }
    let userIndex = users.indexOf(parseInt(userId));
    if (userIndex < 0) {
      return [];
    }
    const result = suggestionPointsMatrix[userIndex].map((value, index) => ({
        videoId: videos[index],
        point: value,
    })).sort((a, b) => b.point - a.point);

    console.log(result);

    return collectionUtils.paginate(result, page, pageSize);
}

const resetMatrix = () => {
    suggestionPointsMatrix = [];
    baseReactionPointsMatrix = [];
    pathWithWeightBetweenUsersMatrix = [];
    similarityMatrix = [];
    pathMatrix = [];
    users = [];
    videos = [];
    points = [];
}

const initMatrix = async () => {
    await buildBaseReactionPointsMatrix();
    const numberOfUser= baseReactionPointsMatrix.length;
    buildSimilarityMatrix(baseReactionPointsMatrix);
    buildPathMatrix();
    buildPathWithWeightBetweenUserMatrix();
    suggestionPointsMatrix = buildSuggestionPointsMatrix(2 * numberOfUser - 1);
    suggestionPointsMatrix = convertElementsToFixedWidth(normalizeMatrix(suggestionPointsMatrix));
    console.log("===========suggestionPointsMatrix==================");
    console.table(suggestionPointsMatrix);
    console.log("===========suggestionPointsMatrix==================");
    return users;
}

module.exports = {
    getRecommendedVideosList,
    resetMatrix,
    initMatrix
}
