# SGF_Node, NodeJS App for Study Group Finder (CEN4010 FAU Project)

# Routes

GET /groups
Returns all groups

POST /groups with body {name: "", class: "", createdBy: "", meetingTimes: [""]}
Creates new group with body & server attributes
