export default (res, status, message) => {
  res.send({
    status: status,
    message: message
  })
}
