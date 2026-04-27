## MongoDB aggregation pipelines

Pipelines are stages how the execution happens for a particular operation such as generating the feed api data so here are the stages involved for getting feed api data

- `$match` => It filters out according to the field provided so here in that case we filter out excluded users by selecting the user id field and we add `$nin` which means (not in) so the whole stage means that filter the users who doesn't belongs to this excluded users list
- `$project` => It includes/excludes fields so here we exclude the password field
- `$addFields` => It adds custom fields so here we need it for storing the calculated skill score and interests score
- But after we add the skillScore and interestScore field how can we add the score count of each ? we need to compare logged in user's skills with other user's skills like array of skills of mine with another user's array of skills how many common skills are there between him and mine so in that case `$size` and `$setIntersection` comes to the picture
- `$setIntersection` finds out the exact common elements between two array of strings and returns that but we want the count of those elements so we use `$size` to wrap the returned value of `$setIntersection`
- `$sort` => It helps to sort the data in particular order and here we need it to rank the user by its skill - interests and last seen activity and `1 for ascending and -1 for descending order sorting`
- `$limit` is used for setting the limit of number of items and in our case users and `$skip` is used to skip the number of items and in our case it is users (Pagination)

### Let's start building the feed api stage by stage

#### $match and $nin

```js
const feed = await UserModel.aggregate([{ $match: { _id: { $nin: excludedUserIds } } }]);
```

#### $project

```js
const feed = await UserModel.aggregate([{ $match: { _id: { $nin: excludedUserIds } } }, { $project: { password: 0 } }]);
```

#### $addFields, $size and $setIntersection

```js
const feed = await UserModel.aggregate([
  { $match: { _id: { $nin: excludedUserIds } } },
  { $project: { password: 0 } },
  {
    $addFields: {
      skillScore: {
        $size: { $setIntersection: ["$skills", loggedInUserSkills] }
      },
      interestScore: {
        $size: { $setIntersection: ["interests", loggedInUserInterests] }
      }
    }
  }
]);
```

#### $sort

```js
const feed = await UserModel.aggregate([
  { $match: { _id: { $nin: excludedUserIds } } },
  { $project: { password: 0 } },
  {
    $addFields: {
      skillScore: {
        $size: { $setIntersection: ["$skills", loggedInUserSkills] }
      },
      interestScore: {
        $size: { $setIntersection: ["interests", loggedInUserInterests] }
      }
    }
  },
  {
    $sort: {
      skillScore: -1,
      interestScore: -1,
      lastSeenAt: -1
    }
  }
]);
```

#### $skip and $limit

```js
const feed = await UserModel.aggregate([
  { $match: { _id: { $nin: excludedUserIds } } },
  { $project: { password: 0 } },
  {
    $addFields: {
      skillScore: {
        $size: { $setIntersection: ["$skills", loggedInUserSkills] }
      },
      interestScore: {
        $size: { $setIntersection: ["interests", loggedInUserInterests] }
      }
    }
  },
  {
    $sort: {
      skillScore: -1,
      interestScore: -1,
      lastSeenAt: -1
    }
  },
  { $skip: (pageNumber - 1) * limitNumber },
  { $limit: limitNumber }
]);
```

## Redis

### Redis Set

This is used to store data into a group (set) as here we are just stroring list of unique strings

Example:

sadd (Set add command)
```
const SWIPES_KEY = `user:${loggedInUserId}:swipes`;
await redis.sadd(SWIPES_KEY, targetUserId.toString());
await redis.expire(SWIPES_KEY, 86400);
```
srem (Set remove command)
```
pipeline.srem(`user:${user1}:connections`, user2);
pipeline.srem(`user:${user2}:connections`, user1);
```

## Socket
- ```io``` is the main global server that handles all the connections and manages connections globally by listening and broadcasting
- ```socket``` is the single user connection that is used to listen and respond to events for that specific user