export default {
    getRandomDog: {
        url: 'image/random'
    },
    getRandomBreedDog: (breed) => ({
        url: `${breed}/images/random`
    }),
    getSubBreeds: (breed) => ({
        url: `${breed}/list`
    }),
    getImagesFromBreed: (breed) => ({
        url: `${breed}/images`
    })
}
