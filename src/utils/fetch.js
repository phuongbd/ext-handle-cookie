export async function requestAPI(url, options = {}) {
  try {
    const { credentials = "include", redirect = "manual" } = options;
    const response = await fetch(url, {
      method: "GET",
      credentials: credentials,
      redirect: redirect,
    });

    if (response.status != 200) {
      return;
    }

    return response.json().then((json) => {
      return {
        status: response.status,
        ok: true,
        statusText: response.statusText,
        result: json,
      };
    });
  } catch (error) {
    return;
    throw error;
  }
}

export async function requestFollowAPI(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      redirect: "follow",
    });

    if (response.status != 200) {
      return;
    }

    return response.json().then((json) => {
      return {
        status: response.status,
        ok: true,
        statusText: response.statusText,
        result: json,
      };
    });
  } catch (error) {
    return;
    throw error;
  }
}

export async function requestAPIResponseText(url, options = {}) {
  try {
    const { credentials = "include", redirect = "manual" } = options;
    const result = await fetch(url, {
      method: "GET",
      credentials: credentials,
      redirect: redirect,
    });

    if (result.status != 200) {
      return;
    }

    return result.text();
  } catch (error) {
    return;
    throw error;
  }
}

export async function requestFollowAPIResponseText(url) {
  try {
    const result = await fetch(url, {
      method: "GET",
      credentials: "include",
      redirect: "follow",
    });
    if (result.status != 200) {
      return;
    }
    return result.text();
  } catch (error) {
    return;
    throw error;
  }
}

export async function requestAPINotOptionsResponseText(url) {
  try {
    const result = await fetch(url, {
      method: "GET",
    });
    if (result.status != 200) {
      return;
    }

    return result.text();
  } catch (error) {
    return;
    throw error;
  }
}

export async function putAPI(url, data) {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    });

    // if(response.status != 200){
    //     return;
    // }

    return response.json().then((json) => {
      return {
        status: response.status,
        ok: true,
        statusText: response.statusText,
        result: json,
      };
    });
  } catch (error) {
    return {
      status: false,
      ok: false,
    };
  }
}

export async function post(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "application/json" },
        data.headers || {}
      ),
      body: JSON.stringify(data),
    });

    if (response.status != 200) {
      return;
    }

    return response.json().then((json) => {
      return {
        status: response.status,
        ok: true,
        statusText: response.statusText,
        result: json,
      };
    });
  } catch (error) {
    return;
    throw error;
  }
}
