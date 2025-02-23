import clientPromise from '.'

let client
let db
let movies

async function init() {
    if(db) return
    try {
        console.log('Attempting to connect to the client...');
        client = await clientPromise;
        console.log("Connected to MongoDB Client");

        console.log('Attempting to get db...');
        db = await client.db();
        console.log("Connected to db");

        console.log('Attempting to get movies collection...');
        movies = await db.collection('movies');
        console.log("Accessing movies collection");

    } catch (error) {
        console.log("Connection error: ", error);
        throw new Error('Failed to establish connection to database');
    }
}

;(async () => {
    await init()
})()

//movie shit

export async function getMovies() {
    try {
        if(!movies) await init()
        const result = await movies
            .find({})
            //.limit(20)
            //.map(user => ({ ...user, _id: user._id.toString() }))
            .toArray()

            console.log("Fetched Movies: ", result);
            
        return {movies: result}
    } catch(error) {
        return{error:'Failed to fetch movies'}
    }
}