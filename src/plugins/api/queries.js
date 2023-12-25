export default {
    getRandomDog: {
        url: 'breeds/image/random',
        isAllowCaching: false
    },
    getAllBreeds: {
        url: 'breeds/list/all'
    },
    getImagesFromBreed: (breed) => ({
        url: `breed/${breed}/images`
    }),
    getRandomBreedDog: (breed) => ({
        url: `breed/${breed}/images/random`,
        isAllowCaching: false
    })
}
