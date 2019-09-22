import store from "./store/index";

export default async (to, from, next) => {
  await store.dispatch("getCurrentUser");
  switch (to.name) {
    case "login":
      return store.getters.isAuth ? next({ path: "/" }) : next();
    case "home":
      return store.getters.isAuth ? next() : next({ path: "/login" });
    case "board":
      return store.getters.isAuth ? next() : next({ path: "/login" });
  }
};
