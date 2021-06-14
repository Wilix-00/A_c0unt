export const state = () => ({
  user: undefined
})

export const mutations = {
  SET_USER (state, payload) {
    state.user = payload.authUser ? payload.authUser.uid : null
  }
}
