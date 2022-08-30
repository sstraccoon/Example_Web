const express = require('express');
const { isLoggedIn, isNotLoggendIn, catchError } = require('./middlewares');
const { getBoardAll, addBoard, getBoard, getWriter, getBoardsSearchedByTitle, getBoardsSearchedByContent, updateBoard, deleteBoard, increaseView, increaseLike, increaseHate, addComment, deleteComment } = require('../controllers/board');


const router = express.Router();

router.get('/', async (req, res, next) => {
    console.log('callboards')
    // const boards = await getBoardAll();
    res.render('board/main'); 
});

router.get('/getBoardAll',  async (req, res, next) => {
    try {
        const boards = await getBoardAll();
        res.json(boards);
    } catch (err) {
        catchError(err, '게시글 불러오기에 실패 했습니다.', next);
    }
});

router.get('/write', isLoggedIn, (req, res, next) => {
    res.render('board/write');
});

router.post('/write', isLoggedIn, async (req, res, next) => {
    try {
        const { title, content } = req.body;
        await addBoard(req.user.id, title, content);
        res.status(200).redirect('/board');;
    } catch (err) {
        catchError(err, '게시글 작성에 실패 했습니다.', next);
    }
});

router.get('/read/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user ? req.user.id : null;
        const board = await getBoard(id);
        const writer = await getWriter(board.userId);   
        await increaseView(id);
        res.render('board/read', {userId, writer, board});
    } catch (err) {
        catchError(err, '게시글 상세 불러오기에 실패 했습니다.', next);
    }
});

router.get('/update/:id', isLoggedIn, async (req, res, next) => {
    try {
        const boardId = req.params.id;
        await isCheckWriter(req.user.id, boardId);
        const board = await getBoard(boardId);
        res.render('board/update', { board });
    } catch (err) {
        catchError(err, '게시글 수정에 실패 했습니다.', next);
    }
});

router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
        const { boardId, title, content } = req.body;
        await isCheckWriter(req.user.id, boardId);
        await updateBoard(boardId, title, content);
        res.status(200).redirect('/board');
    } catch (err) {
        catchError(err, '게시글 작성에 실패 했습니다.', next);
    }
});

router.get('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        await deleteBoard(req.params.id);
        res.status(200).redirect('/board');
    } catch (err) {
        catchError(err, '게시글 삭제에 실패 했습니다.', next);
    }
});

router.get('/like/:id', isLoggedIn, async (req, res, next) => {
    try {
        await increaseLike(req.params.id);
        res.status(200);
    } catch (err) {
        catchError(err, '게시글 종아요 등록에 실패 했습니다.', next);
    }
});

router.get('/search',  async (req, res, next) => {
    try {
        const { type, value } = req.query;
        let boards;
        if (type == 'title'){
            boards = await getBoardsSearchedByTitle(value);
        } else if(type == 'content') {
            boards = await getBoardsSearchedByContent(value);
        }
        res.status(202).json(boards);
    } catch (err) {
        catchError(err, '게시글 종아요 등록에 실패 했습니다.', next);
    }
});

router.post('/write/comment', isLoggedIn, async (req, res, next) => {
    try {
        isCheckWriter(req.user.id, req.body.boardId);
        const { boardId, content } = req.body;
        await addComment(req.body.comment);
        res.status(200);
    } catch (err) {
        catchError(err, '게시글 종아요 등록에 실패 했습니다.', next);
    }
});

router.get('/comment', async (req, res, next) =>{
    try {
        
    } catch (err) {
        catchError(err, '댓글 불러오기에 실패했습니다.', next);
    }
})

router.post('/delete/comment/:id', isLoggedIn, deleteComment, async (req, res, next) => {
    try {
        isCheckWriter(req.user.id, req.body.boardId);
        await deleteComment(req.params.id);
        res.status(200); 
    } catch (err) {
        catchError(err, '게시글 종아요 등록에 실패 했습니다.', next);
    }
});

async function isCheckWriter(userId, boardId) {
    const writerId = await getBoard(boardId).userId;
    if (userId == writerId) {
        return true;
    }
    return false;
};

module.exports = router;