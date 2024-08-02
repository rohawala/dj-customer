import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
    
  },
});
const getToken = () => localStorage.getItem('token');

// Utility function to handle errors
const handleError = (error) => {
  const errorMessage = error.response && error.response.data && error.response.data.message 
    ? error.response.data.message 
    : error.message;

  throw new Error(errorMessage);
};



export const login = async (data) => {
  try {
    const response = await api.post("/users/login", data);
    const token = response.data.token; // Adjust based on your response structure
    localStorage.setItem('token', token);
    console.log(response);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const signup = async (data) => {
  try {
    const response = await api.post("/users/register", data);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const signupdj = async (data) => {
  try {
    const response = await api.post("/users/register_dj", data);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const verifyUser = async (data) => {
  try {
    console.log("api pass a gyaa")
    const response = await api.put("/users/verify",data);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const signout = async () => {
  try {
    const response = await api.post("/users/logout");
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getAlldj = async () => {
  try {
    const response = await api.get("/users/disc_jockey");
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getAllSongs = async (token) => {
  try {
    const response = await api.get("/users/get_songs", {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const postSong = async (data) => {
  try {
    const token = getToken();
    const response = await api.post('/users/post_song', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id) => {
  try {
    console.log("api wali screen Getting user "+id)
    const response = await api.get(`/users/get_user_by_id/${id}`);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const getSongById = async (id) => {
  try {
    const response = await api.get(`/get_songs/${id}`);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const reqSong = async (data) => {
  try {
    const token = getToken();
    console.log('apiiiiiiiiiiiiiiiiiiiiiii')
    console.log('apiii ',data);
    const response = await api.post('/users/request',data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return response;
  } catch (error) {
    handleError(error);
  }
};


export const getAllreq = async () => {
  try {
    const response = await api.get("/users/allReq");
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const updateRequestStatus = async (id, status) => {
  try {
    const token = getToken();
    const response = await api.patch(`/users/request/${id}`, { deliver_status: status });
    return response;
  } catch (error) {
    handleError(error);
  }
};
export const verify = async (data) => {
  try {
    const response = await api.put("/users/verify", data);
    return response;
  } catch (error) {
    handleError(error);
  }
};

// Axios interceptor for auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    const errorMessage = error.response && error.response.data && error.response.data.message;

    if (
      errorMessage === 'Unauthorized' &&
      (error.response.status === 401 || error.response.status === 500) &&
      originalReq &&
      !originalReq._isRetry
    ) {
      originalReq._isRetry = true;

      try {
        await api.get("/refresh", { withCredentials: true });
        return api.request(originalReq);
      } catch (error) {
        handleError(error);
      }
    }
    handleError(error);
  }
);
