import { Router } from 'express'; 
import { checkStudy, isStudyValid, isAccessTokenValid, getUserIdWithAccessToken } from '../middlewares/index.js';
import { StudyServcie } from '../../services/index.js';

const route = Router();

export default (app) => {
  app.use('/studies', route);
  
  // 스터디 리스트 조회
  route.get('/', async (req, res, next) => {
    const { offset, limit, sort, language } = req.query;
    let StudyServcieInstance = new StudyServcie();
    const studies = await StudyServcieInstance.findStudy(offset, limit, sort, language);

    res.status(200).json(studies);
  });
  
  // 스터디 등록  isAuth
  route.post('/', checkStudy, isStudyValid, isAccessTokenValid, async function(req, res, next) {
    try {
      const studyDTO = req.body;
      const userId = req.user._id;

      let StudyServcieInstance = new StudyServcie();
      const study = await StudyServcieInstance.registerStudy(userId, studyDTO);       
      res.status(201).json(study);
    } catch (error) {
      res.status(400).json({ errors: [
        {
          location: 'body',
          param: 'name',
          error: 'TypeError',
          message: 'must be String'
        }
      ], error }); 
    }
  });

  // 스터디 상세 보기
  route.get('/:id', getUserIdWithAccessToken, async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;
    let StudyServcieInstance = new StudyServcie();
    const study = await StudyServcieInstance.findById(id);

    res.status(200).json(study);
  });

  // 스터디 수정
  route.patch('/:id', async (req, res, next) => { 
    const id = req.params.id;
    const studyDTO = req.body;

    let StudyServcieInstance = new StudyServcie();
    const study = await StudyServcieInstance.modifyStudy(id, studyDTO);

    res.status(200).json(study);  
  });

  // 스터디 글 삭제
  route.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    let StudyServcieInstance = new StudyServcie();
    await StudyServcieInstance.deleteStudy(id);
    res.status(204).json();
  });
  

  // 댓글 리스트 조회
  route.get('/comments/:id', async (req, res, next) => {
    const id = req.params.id;

    let StudyServcieInstance = new StudyServcie();
    const comments = await StudyServcieInstance.findComments(id);

    res.status(200).json(comments);
  });

  // 댓글 등록
  route.post('/comments', isAccessTokenValid, async (req, res, next) => {
    const commentDTO = req.body;
    const userId = req.user._id;

    let StudyServcieInstance = new StudyServcie();
    const study = await StudyServcieInstance.registerComment(userId, commentDTO);

    return res.status(201).json(study);
  })

  // 댓글 수정
  route.patch('/comments/:id', async (req, res, next) => {
    const commentDTO = req.body;
    commentDTO.id = req.params.id;

    let StudyServcieInstance = new StudyServcie();
    const comment = await StudyServcieInstance.modifyComment(commentDTO);

    res.status(200).json(comment);
  });

  // 댓글 삭제
  route.delete('/comments/:id', async (req, res, next) => {
    const id = req.params.id;

    let StudyServcieInstance = new StudyServcie();
    await StudyServcieInstance.deleteComment(id);
    res.status(204).json();
  });

  // 좋아요 등록
  route.post('/likes', isAccessTokenValid, async (req, res, next) => {
    const { studyId } = req.body;
    const userId = req.user._id;

    console.log(`studyId : ${studyId}`)
    console.log(`userId : ${userId}`)
    let StudyServcieInstance = new StudyServcie();
    const study = await StudyServcieInstance.addLike(studyId, userId);

    return res.status(201).json(study);
  });

  // 좋아요 삭제
  route.delete('/likes/:id', async (req, res, next) => {
    const userId = req.params.id; // 사용자 id
    const { studyId } = req.body;

    let StudyServcieInstance = new StudyServcie();
    await StudyServcieInstance.deleteLike(studyId, userId);
    res.status(204).json();
  });
}