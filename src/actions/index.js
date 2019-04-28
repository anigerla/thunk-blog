import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder';

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    //await makes sure that fetchPosts request has been completed before dispatching it
    await dispatch(fetchPosts());
    //using lodash's own map function and uniq method, creates a new array that only has unique users' ids in it (leaves out repeated ones)
    // const userIds = _.uniq(_.map(getState().posts, 'userId'));
    //async/await does not work with forEach method; could use .map method with promises
    // userIds.forEach(id => dispatch(fetchUser(id)));

    //
    _.chain(getState().posts)
      .map('userId')
        .uniq()
          .forEach(id => dispatch(fetchUser(id)))
            .value()
};

// a function that returns a function
export const fetchPosts = () => async dispatch => {
    const response = await jsonPlaceholder.get('/posts');

    dispatch ({ type: 'FETCH_POSTS', payload: response.data });
};

//MEMOIZED APPROACH:
// export const fetchUser = id => dispatch => _fetchUser(id, dispatch);

//underscore shows that it is a very app specific function and should not be used unless the user knows for sure what (s)he is doing
// const _fetchUser = _.memoize(async (id, dispatch) => {
//     const response = await jsonPlaceholder.get(`/users/${id}`);

//     dispatch ({ type: 'FETCH_USER', payload: response.data })
// });
//can't refetch the user with this action creator (e.g. when user info has changed; will need another action creator with the same logic sans memoize)
//---------------------------------------------------------- 

export const fetchUser = id => async dispatch => {
    const response = await jsonPlaceholder.get(`/users/${id}`);

    dispatch ({ type: 'FETCH_USER', payload: response.data });
};