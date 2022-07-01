export async function post({ locals }) {
    const { user, accessToken, error } = locals;
    return {
      status: 200,
      body: {
        user,
        accessToken,
        error
      }
    };
  }