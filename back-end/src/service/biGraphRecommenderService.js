const { Log } = require("../model/Log");
const { RecommendPoints } = require("../model/RecommendPoints");
const { WatchedVideo } = require("../model/WatchedVideo");
const videoService = require("./videoService");
const Video = require("../model/Video");
const collectionUtils = require("../utils/CollectionUtils");
const {VIDEO_STATUS} = require("../constant/enum/ENUM");
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
    console.log(baseReactionPointsMatrix);

    if (!baseReactionPointsMatrix || baseReactionPointsMatrix.length === 0) {
        const recommendPoints = await RecommendPoints.find();
        console.log(recommendPoints)
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
            points[users.indexOf(user)][videos.indexOf(video)] = data.point;
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
    }
    if (pointMatrix[user1Index][videoIndex] === 0 || pointMatrix[user2Index][videoIndex] === 0) {
      return 0;
    }

    return ((maxNumber - Math.abs(pointMatrix[user1Index][videoIndex] - pointMatrix[user2Index][videoIndex])) / maxNumber);

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
            let sum = 0;
            let videoLength = videos.length;
            for (let k = 0; k < videoLength; k ++) {
              sum += similarityPoint(i, j, k, pointMatrix, maxPoint);
            }
            row.push(sum / videoLength);
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
    let result = []
    let userIndex = users.indexOf(parseInt(userId));
    if (userIndex < 0) {
        const publicVideos = await Video.findAll({
            where: {
                status: VIDEO_STATUS.PUBLIC
            },
            order: [['views', 'DESC']],
        })

        // Push all videos Id to result array, if not in array create new {videoId, point: 0}
        publicVideos.forEach(publicVideo => {
            const foundIndex = result.findIndex(item => item.videoId === publicVideo.id);
            if (foundIndex === -1) {
                result.push({
                    videoId: publicVideo.id,
                    point: 0
                });
            }
        });
        return collectionUtils.paginate(result, page, pageSize);
    }
    result = suggestionPointsMatrix[userIndex].map((value, index) => ({
        videoId: videos[index],
        point: value,
    })).sort((a, b) => b.point - a.point);

    const publicVideos = await Video.findAll({
      where: {
        status: VIDEO_STATUS.PUBLIC
      },
      order: [['views', 'DESC']],
    })

    // Push all videos Id to result array, if not in array create new {videoId, point: 0}
    publicVideos.forEach(publicVideo => {
    const foundIndex = result.findIndex(item => item.videoId === publicVideo.id);
    if (foundIndex === -1) {
      result.push({
        videoId: publicVideo.id,
        point: 0
      });
    }
    });

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
