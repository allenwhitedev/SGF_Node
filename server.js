// imports & requires
let express = require('express')
let mongodb = require('mongodb')
let bodyParser = require('body-parser')

let app = express()
app.use(bodyParser.urlencoded({extended: true}))
let MongoClient = mongodb.MongoClient
let ObjectId = require('mongodb').ObjectID

// allows CORS
app.use(function(req, res, next) 
{
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})



// start mongo & node servers
let mongoURL = 'mongodb://sgfDBAdmin:mvfsgc@ds133358.mlab.com:33358/study_group_finder' // production (mongo lab) url 
//let mongoURL = 'mongodb://localhost:27017/study_group_finder' // dev mongo url
MongoClient.connect(mongoURL, (err, database) => 
{
	if (err) 
		return console.log(err)
	db = database
	
	// start node app on development/production server
	let nodeURL = process.env.PORT || 3000
	let nodeEnvironment = (nodeURL === 3000 ? "development" : "production")
	app.listen(nodeURL, () => 
		console.log("SGF Node App listening in", nodeEnvironment)) 
})

// get home page test message
app.get('/', (req, res) =>
{
	res.type('text/plain')
	res.send("SGF home page")
})

// gets all groups
app.get('/groups', (req, res) =>
{
	db.collection('groups').find().toArray((err, result) => 
	{
		if (err)
			console.log(err)
		else
			res.json(result)
	})	
})

// get group by name
app.get('/groups/:groupId', (req, res) =>
{
	let tmp = db.collection('groups').findOne({_id: ObjectId(req.params.groupId)}, 
		(err, doc) =>
		{
			if (err)
				console.log(err)
			res.json(doc)
		})
})


// add group - requires name, class, createdBy, meetingTime(s)
app.post('/groups', (req, res) => 
{
	let group = req.body

	if ( !group.name || !group.class || !group.createdBy || !group.meetingTimes )
		return res.status(500).send("Incorrect format for new group")

	// set optional fields to default values if not provided
	group.locationName = group.locationName || "Campus"
	group.description = "We're here to study" 

	// generate appropriate fields for group
	group.gravatar = "gravatar" + ( Math.floor( Math.random() * 5 ) + 1 ) // 1-5
	group.lastActivityAt = new Date()
	group.createdAt = group.lastActivityAt
	group.members = [ group.createdBy ]

	group = 
	{	
		name: group.name, 
		class: group.class,
		description: group.description,
		members: group.members,
		meetingTimes: group.meetingTimes,
		locationName: group.locationName,
		gravatar: group.gravatar,
		lastActivityAt: group.lastActivityAt,
		createdAt: group.createdAt
	}

	db.collection('groups').insert(group, (err, result) => 
	{
		if (err) 
			return console.log(err)	
		console.log('saved group to database')
		res.sendStatus(200) // send 200 OK status on success
	})
})

// join group
app.patch('/groups/:groupId', (req, res) =>
{
	console.log('req.params.groupId', req.params.groupId)
	console.log('req.body.userId', req.body.userId)

	let tmp = db.collection('groups').update({_id: ObjectId(req.params.groupId) }, 
		{$addToSet: {members: req.body.userId} }, 
		(err, result) => 
		{
			if (err)
				console.log(err)
			res.status(200).send(result)
		})
})

// create user - requires name, email, password)
app.post('/', (req, res) => 
{
	console.log('attempt create user')
	let user = req.body

	if ( !user.name || !user.email || !user.password )
		return res.status(500).send("Incorrect format for new user")

	// generate appropriate fields for user
	user.gravatar = "gravatar" + ( Math.floor( Math.random() * 5 ) + 1 ) // 1-5
	user.lastActivityAt = new Date()
	user.createdAt = user.lastActivityAt

	user = 
	{	
		name: user.name, 
		email: user.email,
		password: user.password,
		gravatar: user.gravatar,
		reminders: [],
		lastActivityAt: user.lastActivityAt,
		createdAt: user.createdAt
	}

	db.collection('users').insert(user, (err, result) => 
	{
		if (err) 
			return console.log(err)	
		console.log('saved user to database')
		res.status(200).send(user) // send user info to client on success
	})
})



