const { Board, User, Comment } = require('../models');
const controllerError = require('../error/controllerError');
const sequelize = require('sequelize');
const Op = sequelize.Op;

exports.getBoardAll = async () => {
    try {
        const boards = await Board.findAll({
            attributes: ['id', 'title', 'viewCount', 'likeCount', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['nick'],    
        }});
        return boards;
    } catch (err) {
        console.log(err);
        throw new controllerError('게시글 불러오기에 실패했습니다.');
    }
};

exports.addBoard = async (id, title, content) => {
    try {
        await Board.create({
            userId: id,
            title: title,
            content: content,
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('게시글 작성에 실패했습니다.');
    }
};

exports.getBoard = async (id) => {
    try {
        const board = await Board.findOne({
            where: {'id': id},
            attributes: ['id', 'title', `content`, 'viewCount', 'likeCount', 'hateCount', 'createdAt', 'userId'],
        });
        return board;
    } catch (err) {
        console.error(err);
        throw new controllerError('게시글 상세 불러오기에 실패했습니다.');
    }
};

exports.getBoardsSearchedByTitle = async (value) => {
    try {
        const boards = await Board.findAll({
            where: { title: {
                            [Op.like]: "%" + value + "%"
                        }
                    },
            attributes: ['id', 'title', `content`, 'viewCount', 'likeCount', 'hateCount', 'createdAt', 'userId'],
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['nick'],    
        }});
        return boards;
    } catch (err) {
        console.error(err);
        throw new controllerError('제목으로 검색된 보드 불러오기에 실패했습니다.');
    }
}

exports.getBoardsSearchedByContent = async (value) => {
    try {
        const boards = await Board.findAll({
            where: { content: {
                            [Op.like]: "%" + value + "%"
                        }
                    },
            attributes: ['id', 'title', `content`, 'viewCount', 'likeCount', 'hateCount', 'createdAt', 'userId'],
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['nick'],    
        }});
        return boards;
    } catch (err) {
        console.error(err);
        throw new controllerError('내용으로 검색된 보드 불러오기에 실패했습니다.');
    }
};

exports.getWriter = async (id) => {
    try {
        const wirter = await User.findOne({
            where: {'id': id},
            attributes: ['nick'],
        });
        return wirter;
    } catch (err) {
        console.error(err);
        throw new controllerError('게시글 작성자 닉네임 불러오기에 실패했습니다.');
    }
};

exports.increaseView = async (id) => {
    try {
        await Board.increment({
            viewCount: 1,
        }, {
            where: { id },
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('조회수 증가에 실패했습니다.');
    }
};


exports.increaseLike = async (id) => {
    try {
        await Board.increment({
            viewCount: 1,
        }, {
            where: { id },
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('조회수 증가에 실패했습니다.');
    }
};


exports.increaseHate = async (id) => {
    try {
        await Board.increment({
            viewCount: 1,
        }, {
            where: { id },
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('조회수 증가에 실패했습니다.');
    }
};

exports.updateBoard = async (id, title, content) => {
    try {
        const board = await Board.update({
            title,
            content,
        }, {
            where: { id },
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('게시글 수정을 실패했습니다.');
    }
}; 

exports.deleteBoard = async (id) => {
    try {
        await Board.destroy({
            where: { id },
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('게시글 삭제를 실패했습니다.');
    }
};

exports.getComment = async (boardId) => {
    try {
        const comments = await Comment.findAll({
            attributes: ['id', 'content', 'createdAt', 'userId', 'boardId', 'originCommentId'],
            where: { boardId },
            order: [['createdAt', 'DESC']],
            include:{
                model: User,
                attributes: ['nick'],
            }
        })
        return comments;
    } catch (err) {
        console.error(err);
        throw new controllerError("댓글 불러오기에 실패했습니다.");
    }
}

exports.addComment = async (userId, boardId, content) => {
    try {
        await Comment.create({
            content: content,
            userId: userId,
            boardId: boardId,
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('댓글 작성에 실패했습니다.');
    }
};

exports.countComment = async (id) => {
    // await Comment.count
}

exports.deleteComment = async (id) => {
    try {
        await Comment.destroy({
            where: id,
        });
        return;
    } catch (err) {
        console.error(err);
        throw new controllerError('댓글 삭제에 실패했습니다.');
    }
};  

// try {

// } catch (err) {
//     console.error(err);
//     throw new Error('');
// }