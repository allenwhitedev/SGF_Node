# SGF_Node, NodeJS App for Study Group Finder (CEN4010 FAU Project)

# Routes (return JSON)

GET /
# Returns test message "SGF home page"

GET /groups
# Returns all groups

GET /groups/:groupId
# Gets group by id

POST /groups with body {name: "", class: "", createdBy: "", meetingTimes: [""]}
# Creates new group with body & server attributes

PATCH /groups/:groupID body {userId: ""}
# Joins group with user matching userId

POST / with body {name, email, password}
# Creates user, returns user info

