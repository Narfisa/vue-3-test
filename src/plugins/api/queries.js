export default {
    getRandomDog: {
        url: 'breeds/image/random',
        isAllowCaching: false
    },
    getImagesFromBreed: (breed) => ({
        url: `breeds/${breed}/images`
    }),
    getAllBreeds: {
        url: 'breeds/list/all'
    },
    getRandomBreedDog: (breed) => ({
        url: `breed/${breed}/images/random`
    })
}
