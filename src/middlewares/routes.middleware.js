function verifyUser(request, response, next){
    const { username } = request.headers
    const findObj = users.find((users) => users.username === username);
    
    request.username = findObj
    
    return findObj ? next() : response.status(400).json({"error":"This username doesn't exist!"});
}

module.exports = verifyUser