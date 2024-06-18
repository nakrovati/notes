export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  const data = await useRequestFetch()("/api/account/user");
  if (data) {
    user.value = data;
  }
});
