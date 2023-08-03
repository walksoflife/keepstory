export const getRootComments = (comments) => {
  try {
    return (
      comments &&
      comments
        .filter((c) => !c.commentParent)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  } catch (error) {
    console.log(error);
  }
};

export const getReplyComments = (comments, commentId) => {
  try {
    return (
      comments &&
      comments
        .filter((c) => c.commentParent === commentId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  } catch (error) {
    console.log(error);
  }
};
