import React, { useRef, useState } from "react";
import styles from "./rating.module.css";
import ReactStars from "react-rating-stars-component";
import userService from "../../service/user_service";
import { toast } from "react-toastify";

const Rating = (props) => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const inputRef = useRef();

  const ratingChanged = (score) => {
    setRating(score);
  };
  const handleClick = () => {
    setShowRating((state) => !state);
  };
  const onSubmit = async () => {
    await userService.submitFeedback({
      rating,
      content: inputRef.current.value,
    });
    setShowRating((state) => !state);
    toast.success("피드백이 제출되었어요!", {
      position: "top-right",
      autoClose: 3000,
    });
  };
  return (
    <>
      {showRating ? (
        <section className={styles.container}>
          <header className={styles.header}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>Hola에 만족하셨나요?</div>
              <div className={styles.exitWrapper} onClick={handleClick}>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  tabIndex="1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </div>
            </div>
            <div className={styles.content}>
              더 좋은 서비스를 제공해 드릴 수 있도록, 별점과 함께 피드백을
              남겨주세요!
            </div>
          </header>

          <div className={styles.ratings}>
            <ReactStars
              isHalf={true}
              count={5}
              onChange={ratingChanged}
              size={64}
              activeColor="#ffd700"
            />
          </div>

          <input
            type="text"
            name="textbox"
            placeholder="평가를 입력해주세요..."
            ref={inputRef}
          />
          <footer className={styles.footer}>
            <button className={styles.submitButton} onClick={onSubmit}>
              제출
            </button>
          </footer>
        </section>
      ) : (
        <div className={styles.ratingIcon}>
          <img
            className={styles.ratingIconImg}
            src="/images/logo/hola_default.png"
            alt="default loading spinner"
            onClick={handleClick}
          />
        </div>
      )}
    </>
  );
};

export default Rating;