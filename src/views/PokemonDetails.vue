<template>
    <section class="pokemonContainer">
        <div class="infoContainer">
            <div class="pokemonArea">
                <div>
                    <div :style="{backgroundColor: typePallete[type1]}" class="pokeAvatarArea">
                        <picture>
                            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`"/>
                        </picture>
                    </div>
                    
                    <div class="pokeInfo" >
                        <div>ID: {{ id }}</div>
                        <p>{{ capitalizeFirstLetter(name) }}</p>
                    </div>

                    <div class="pokeTypeArea">
                        <div :style="{backgroundColor: typePallete[type1]}" class="pokeType">
                            {{  capitalizeFirstLetter(type1) }}
                        </div>
                        <div v-if="type2" :style="{backgroundColor: typePallete[type2]}" class="pokeType">
                            {{  capitalizeFirstLetter(type2) }}
                        </div>
                    </div>
                </div>
                    <div class="allAttributes">
                        <ul>
                            <li>HP: {{ hp }}</li>
                            <li>Attack: {{ attack }}</li>
                            <li>Defense: {{ defense }}</li>
                            <li>Sp Attack: {{ spatt }}</li>
                            <li>Sp Defense: {{ spdef }}</li>
                            <li>Speed: {{ speed }}</li>
                            <li>Weight: {{ weight }}</li>
                            <li>Height: {{ height }}</li>
                        </ul>
                    </div>
            </div>
            <div class="pokeStats">

                <div class="totalEvoArea">
                    <h3>Evolutions</h3>
                    <div class="allEvolutions">
                        <div  v-if="evoChainData1 && evoChainData2" :style="{backgroundColor: typePallete[type1]}" class="evolvedArea">
                            <img  :src="getImg(evoChainData1)"/>
                        </div>
                        <div  v-if="evoChainData2" :style="{backgroundColor: typePallete[type1]}" class="evolvedArea">
                            <img  :src="getImg(evoChainData2)"/>
                        </div>
                        <div  v-if="evoChainData3" :style="{backgroundColor: typePallete[type1]}" class="evolvedArea">
                            <img  :src="getImg(evoChainData3)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
    import axios from 'axios';

    export default {
        data(){
            return {
                pokemonDetails: {},
                name: '',
                id: '',
                type1: '',
                type2: '',
                hp: '',
                attack: '',
                defense: '',
                spatt: '',
                spdef: '',
                speed: '',
                weight: '',
                height: '',
                evolution: '',
                evoChainData1: '',
                evoChainData2: '',
                evoChainData3: '',
                typePallete: {
                    'grass'   :  "#82b435",
                    'poison'  :  "#a55bba",
                    'fire'    :  "#ec6202",
                    'flying'  :  "#13b7e6",
                    'water'   :  "#3477a2",
                    'bug'     :  "#8cbc55",
                    'normal'  :  "#A4ACAF",
                    'electric' : "#ddc213",
                    'ground'  :  "#AB9842",
                    'fairy'   :  "#FDB9E9",
                    'fighting':  "#D56723",
                    'psychic' :  "#F366B9",
                    'rock'    :  "#A38C21",
                    'steel'   :  "#9EB7B8",
                    'ice'     :  "#51C4E7",
                    'ghost'   :  "#7B62A3",
                    'dragon'  :  "#ed4528",
                },
            }
        },
        mounted(){
            this.getDetails()
        },

        methods: {
            getDetails() {
                const pokemonUrl = this.$route.params.url;
                axios
                    .get(pokemonUrl)
                    .then(response => {
                        this.name = response.data.name
                        this.info = response.data
                        this.id = this.getId(response.data.forms[0].url)
                        this.type1 = response.data.types[0].type.name
                        this.hp = this.info.stats[0].base_stat
                        this.attack = this.info.stats[1].base_stat
                        this.defense = this.info.stats[2].base_stat
                        this.spatt = this.info.stats[3].base_stat
                        this.spdef = this.info.stats[4].base_stat
                        this.speed = this.info.stats[5].base_stat
                        this.height = this.info.height
                        this.weight = this.info.weight
                        this.getEvolutionData(this.id)

                        if(response.data.types[1] !== undefined){
                                            this.type2 = response.data.types[1].type.name
                                        } else{
                                            this.type2 = ''
                                        }
                        })
                        .catch(error => {
                            this.errored = true;
                            console.error('Axios request error:', error);
                        });
                        
            },
            getEvolutionData(id){
                axios
                    .get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
                    .then(response => {
                        this.evoData = response.data.evolution_chain.url
                        axios
                            .get(this.evoData)
                            .then(response => {
                                this.evoChainData1 = response.data.chain.species.url
                                this.path = response.data
                                if(response.data.chain.evolves_to.length > 0){
                                    this.evoChainData2 = response.data.chain.evolves_to[0].species.url
                                    if(response.data.chain.evolves_to.length > 0 ){
                                        this.evoChainData3 = response.data.chain.evolves_to[0].evolves_to[0].species.url
                                    } else{
                                        this.evoChainData3 = ''
                                    }
                                } else{
                                    this.evoChainData2 = ''
                                }
                            })
                            .catch(error => {
                            this.errored = true;
                            console.error('Axios request error:', error);
                        });

                    })
                    .catch( error => {
                        this.errored = true;
                        console.error('Error in request 2', error)
                    })
            },
            getId(url){
                return url.split('/').at(6)
            },
            getImg(url){
                const id = this.getId(url)
                
                return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            },
            capitalizeFirstLetter(name){
                if(name !== ''){
                
                const capitalizedFirst = name[0].toUpperCase();
                const rest = name.slice(1);
                return capitalizedFirst + rest;

                } else {
                    return ''
                }
            }
        }

    }
</script>

<style scoped lang="scss">
    @import url(../assets/pokemonDetails.scss);
</style>