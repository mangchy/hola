import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatDate } from "../../common/utils";
import CommentContainer from "../../component/comment_container/commentContainer";
import LikesAndViews from "../../component/likes_and_views/likesAndViews";
import studyService from "../../service/study_service";
import { setPost } from "../../store/write";
import RecommendPost from "../recommend_post/recommendPost";
import StudyButtons from "../study_buttons/studyButtons";
import styles from "./studyContent.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const StudyLanguage = ({ languages }) => {
  const usedLanguage = languages.map((lang) => lang.value);
  return (
    <section className={styles.usedLanguageWrapper}>
      <div className={styles.usedLanguageInfo}>사용 언어 :</div>
      <ul className={styles.languageList}>
        {usedLanguage.map((lang, i) => (
          <LangItem Language={lang} key={i}></LangItem>
        ))}
      </ul>
    </section>
  );
};

const LangItem = ({ Language }) => {
  return <li className={styles.languageItem}>{Language}</li>;
};

const StudyContent = ({ id }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const read = useSelector((state) => state.read);

  // console.log("read : ", read);
  const handleDelete = async (id) => {
    await studyService.deleteStudy(id);
    document.body.style.overflow = "auto";
    toast.success("글 삭제가 완료되었어요!", {
      position: "top-right",
      autoClose: 3000,
    });
    history.push("/");
  };

  const handleEnd = async (editValue) => {
    await studyService.editClose(id, editValue);
  };

  const handleEdit = (dispatch, history) => {
    dispatch(setPost(read.post));
    history.push("/register");
  };

  const handleBack = () => {
    history.goBack();
  };
  const defaultPath =
    "https://hola-post-image.s3.ap-northeast-2.amazonaws.com/";

  return (
    <div className={styles.wrapper}>
      <section className={styles.postHeader}>
        <FaArrowLeft
          size="30"
          color="808080"
          cursor="pointer"
          onClick={handleBack}
        />
        <div className={styles.title}>{read.post.title}</div>
        <div className={styles.userAndDate}>
          <div className={styles.user}>
            <img
              className={styles.userImg}
              src={defaultPath + read.post.imagePath}
              alt="userImg"
            />
            <div className={styles.userName}>{read.post.nickname}</div>
          </div>
          <div className={styles.registeredDate}>
            {formatDate(read.post.createdAt)}
          </div>
        </div>
        {user.nickName === read.post.nickname && (
          <StudyButtons
            history={history}
            dispatch={dispatch}
            handleEdit={handleEdit}
            handleDelete={() => handleDelete(id)}
            handleEnd={handleEnd}
            isClosed={read.post.isClosed}
          ></StudyButtons>
        )}
        <RecommendPost id={id}></RecommendPost>

        <StudyLanguage languages={read.post.language}></StudyLanguage>
      </section>
      <div className={styles.postContentWrapper}>
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: read.post.content }}
        ></div>
      </div>

      <section className={styles.modalComment}>
        <LikesAndViews
          views={read.post.views}
          likeUser={read.post.likes}
          totalLikes={read.post.totalLikes}
          studyId={read.post.id}
          userId={user.id}
        ></LikesAndViews>
        <div className={styles.postComment}>
          <CommentContainer id={read.post.id}></CommentContainer>
        </div>
      </section>
    </div>
  );
};

export default StudyContent;
