import "../../assets/detail.css";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import {
  initState as videoState,
  videoReducer,
  fetchVideo,
  fetchVideos,
} from "../../reducers/videoReducer"; // reduce 스타일 import
import { useDispatch, useSelector } from "react-redux"; // redux스타일 import1
import {
  subscribe,
  unsubscribe,
  subCount,
  fetchSub,
} from "../../store/subscribeSlice"; // redux스타일 import2, reduce와 다르게 초기값같은건 안불러오고 액션함수명만 불러오면된다.
import { createComment, fetchComments } from "../../store/commentSlice";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Detail = () => {
  const { videoCode } = useParams();
  const { token, id } = useAuth();

  const [isComment, setIsComment] = useState(false);
  const [newComment, setNewComment] = useState({
    commentText: "",
    videoCode: videoCode,
    id: id,
  });

  // 이건 reduce방식 계속 유지해서 냅뒀음
  // 리덕스툴킷방식으로 바꾸고싶으면 바꿔도되나, 실제 프로젝트에선 하나로 통일할것
  const [state, videoDispatch] = useReducer(videoReducer, videoState);
  const { video, videos } = state;

  // 리덕스 툴킷 방식 - 구독
  // 매번 videoDispatch, subscribeDispatch 해줄필요없음
  const dispatch = useDispatch(); // redux는 dispatch하나만 지정하면 계속 사용 가능하다.

  const isSub = useSelector((state) => state.subscribe.isSub);
  const count = useSelector((state) => state.subscribe.count);
  const sub = useSelector((state) => state.subscribe.sub);
  const comments = useSelector((state) => state.comment.comments);

  const handleSub = () => {
    if (isSub) {
      // 구독중 -> 구독 취소
      dispatch(unsubscribe(sub?.subCode));
    } else {
      // 구독 -> 구독
      dispatch(subscribe({ channelCode: video.channel.channelCode }));
    }
  };

  // 댓글 추가
  const addComment = () => {
    dispatch(createComment(newComment));
    setIsComment(false);
    setNewComment({ ...newComment, commentText: "" });
  };

  // 비디오별 댓글 전체 보여주기

  useEffect(() => {
    fetchVideo(videoDispatch, videoCode);
    fetchVideos(videoDispatch, 1, "");
    dispatch(fetchComments(videoCode));
  }, []);

  useEffect(() => {
    if (video != null) {
      dispatch(subCount(video.channel.channelCode));
      if (token != null) {
        dispatch(fetchSub(video.channel.channelCode));
      }
    }
  }, [video, token, handleSub]);

  return (
    <main className="detail">
      <div className="video-detail">
        <video controls src={video?.videoUrl}></video>
        <h2>{video?.videoTitle}</h2>
        <div className="video-detail-desc">
          <div className="detail-desc-left">
            <img src={video?.channel.channelImg} />
            <div className="channel-desc">
              <h3>{video?.channel.channelName}</h3>
              <p>구독자 {count}명</p>
            </div>
            <button onClick={handleSub}>{isSub ? "구독중" : "구독"}</button>
          </div>
        </div>
        <div className="video-detail-info">{video?.videoDesc}</div>
        <div className="comment">
          <input
            className="comment-add"
            type="text"
            placeholder="댓글 추가.."
            value={newComment.commentText}
            onChange={(e) =>
              setNewComment({ ...newComment, commentText: e.target.value })
            }
            onClick={() => setIsComment(true)}
          />
          {isComment && (
            <div className="comment-add-status">
              <button onClick={() => setIsComment(false)}>취소</button>
              <button onClick={addComment}>댓글</button>
            </div>
          )}
          <div className="comment-list">
            {comments.map((comment) => (
              <div className="comment-content">
                <h4>{comment.id}</h4>
                <p>{comment.commentText}</p>
                <button>답글</button>
                <input type="text" placeholder="답글 추가.."/>
                <div className="reply-add-status">
                  <button>취소</button>
                  <button>답글</button>
                  </div>
                </div>
            ))}
          
        </div>
      </div>
      <div className="video-list">
        {videos.map((video) => (
          <a
            href={`/video/${video.videoCode}`}
            className="video-list-card"
            key={video.videoCode}
          >
            <img src={video.videoImg} />
            <div className="video-list-desc">
              <h4>{video.videoTitle}</h4>
              <p>{video.channel.channelName}</p>
              <p className="video-meta">조회수 {video.videoCount}회</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
};
export default Detail;
