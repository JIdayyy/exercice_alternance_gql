var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

var schema = buildSchema(`
    input CourseInput {
        title: String
        author: String
        description : String
        topic: String
        url: String
      }
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
     
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        addCourse(input: CourseInput): [Course]
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
  
`);

var coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/",
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/",
  },
];

var addCourse = function (args) {
  var id = coursesData.length + 1;
  const data = args.input;
  const body = { id, ...data };
  coursesData.push(body);
  console.log(coursesData);
  return coursesData;
};

var getCourse = function (args) {
  var id = args.id;
  return coursesData.filter((course) => {
    return course.id == id;
  })[0];
};

var getCourses = function (args) {
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};

var root = {
  course: getCourse,
  courses: getCourses,
  addCourse: addCourse,
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
