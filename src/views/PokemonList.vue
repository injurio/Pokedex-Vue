<template>
    <section class="pokeModal">
        <div class="searchBarBox">
            <input class="searchBar" v-model="searchPokemon" type="text" placeholder="Enter name or ID... ">
        </div>
        <div class="wrapper">
            <div class="wrappedContent">
                <div @click="openPokemonDetails(pokemon.url)" class="elementArea"
                    v-for="(pokemon, index) in displayedPokemon" :key="pokemon.name">
                    <div>
                        <div :style="{ backgroundColor: typePallete[primaryTypes[index]] }" class="pokemonFrame">
                            <img style="height:80px; width:70px;" :src="getImg(pokemon.url)" :alt="pokemon.name" />
                        </div>
                        <div class="pokemonTextArea">
                            <div>ID: {{ getId(pokemon.url) }}</div>
                            <p>{{ capitalizeFirstLetter(pokemon.name) }}</p>
                        </div>
                    </div>
                    <div class="pokemonTypeArea">
                        <div v-if="primaryTypes[index]" :style="{ backgroundColor: typePallete[primaryTypes[index]] }"
                            class="typeBox">
                            {{ capitalizeFirstLetter(primaryTypes[index]) }}
                        </div>
                        <div v-if="secondaryTypes[index]" :style="{ backgroundColor: typePallete[secondaryTypes[index]] }"
                            class="typeBox">
                            {{ capitalizeFirstLetter(secondaryTypes[index]) }}
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </section>
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @updatePage="updatePage" />
</template>


<script>
import axios from 'axios';
import Pagination from '../components/Pagination.vue';

export default {
    components: {
        Pagination
    },
    data() {
        return {
            info: [],
            filteredPokemons: [],
            primaryTypes: [],
            secondaryTypes: [],
            pokemonsPerPage: 9,
            endpoints: [],
            loading: true,
            errored: false,
            currentPage: 1,
            totalPages: 1,
            typePallete: {
                'grass': "#82b435",
                'poison': "#a55bba",
                'fire': "#ec6202",
                'flying': "#13b7e6",
                'water': "#3477a2",
                'bug': "#8cbc55",
                'normal': "#A4ACAF",
                'electric': "#ddc213",
                'ground': "#AB9842",
                'fairy': "#FDB9E9",
                'fighting': "#D56723",
                'psychic': "#F366B9",
                'rock': "#A38C21",
                'steel': "#9EB7B8",
                'ice': "#51C4E7",
                'ghost': "#7B62A3",
                'dragon': "#ed4528",
            },
            searchPokemon: '',

        }

    },

    mounted() {
        this.getPokemons()
    },

    methods: {
        getPokemons() {
            axios
                .get("https://pokeapi.co/api/v2/pokemon?limit=1010")
                .then(response => {
                    this.info = response.data.results
                    this.filteredPokemons = this.info

                    for (var i = 0; i < this.filteredPokemons.length; i++) {

                        this.endpoints.push(this.filteredPokemons[i].url)
                    }


                    axios.all(this.endpoints.map((endpoint) => axios.get(endpoint)))
                        .then((data) => {

                            for (var index = 0; index < this.filteredPokemons.length; index++) {


                                this.primaryTypes.push(data[index].data.types[0].type.name)

                                if (data[index].data.types[1] !== undefined) {
                                    this.secondaryTypes.push(data[index].data.types[1].type.name)
                                } else {
                                    this.secondaryTypes.push('')
                                }
                            }
                        })

                    this.totalPages = Math.ceil(this.filteredPokemons.length / this.pokemonsPerPage)
                    this.$emit('totalPagesUpdated', this.totalPages)
                })
                .catch(error => {
                    // Handle the error here, for example by setting this.errored to true
                    this.errored = true;
                    console.error('Axios request error:', error);
                });

        },

        getId(url) {
            return url.split('/').at(6)
        },
        getImg(url) {
            const id = this.getId(url)

            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        },
        capitalizeFirstLetter(name) {
            if (name !== '') {

                const capitalizedFirst = name[0].toUpperCase();
                const rest = name.slice(1);
                return capitalizedFirst + rest;

            } else {
                return ''
            }
        },
        updateTotalPages(totalPages) {
            this.totalPages = totalPages;
        },
        updatePage(newPage) {
            this.currentPage = newPage;
        },
        openPokemonDetails(url) {
            this.$router.push({ name: 'PokemonDetails', params: { url: url } })
        },


    },
    watch: {
        searchPokemon(newQuery) {

            this.endpoints = []
            this.primaryTypes = []
            this.secondaryTypes = []


            const query = newQuery.toLowerCase();
            this.filteredPokemons = this.info.filter(pokemon =>
                pokemon.name.includes(query) ||
                pokemon.url.split('/').at(6).includes(query)
            )


            for (var i = 0; i < this.filteredPokemons.length; i++) {

                this.endpoints.push(this.filteredPokemons[i].url)

            }

            this.currentPage = 1;

            axios.all(this.endpoints.map((endpoint) => axios.get(endpoint)))
                .then((data) => {

                    for (var index = 0; index < this.filteredPokemons.length; index++) {


                        this.primaryTypes.push(data[index].data.types[0].type.name)

                        if (data[index].data.types[1] !== undefined) {
                            this.secondaryTypes.push(data[index].data.types[1].type.name)
                        } else {
                            this.secondaryTypes.push('')
                        }
                    }
                })

        },
        currentPage: "getPokemons",

    },
    computed: {
        displayedPokemon() {
            const start = (this.currentPage - 1) * this.pokemonsPerPage
            const end = start + this.pokemonsPerPage

            this.endpoints = []
            this.primaryTypes = []
            this.secondaryTypes = []

            for (var i = 0; i < this.filteredPokemons.slice(start, end).length; i++) {

                this.endpoints.push(this.filteredPokemons.slice(start, end)[i].url)

            }

            axios.all(this.endpoints.map((endpoint) => axios.get(endpoint)))
                .then((data) => {

                    for (var index = 0; index < this.filteredPokemons.slice(start, end).length; index++) {


                        this.primaryTypes.push(data[index].data.types[0].type.name)

                        if (data[index].data.types[1] !== undefined) {
                            this.secondaryTypes.push(data[index].data.types[1].type.name)
                        } else {
                            this.secondaryTypes.push('')
                        }
                    }
                })


            return this.filteredPokemons.slice(start, end);



        }
    }



}

</script>



<style lang="scss" scoped>
@import url(../assets/pokemonList.scss);
</style>
