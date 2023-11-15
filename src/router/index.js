import { createRouter, createWebHistory } from 'vue-router'
import PokemonList from '../views/PokemonList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      redirect: '/pokemons',
      name: 'PokemonList',
      component: PokemonList 
    },
    { 
      path: '/pokemons', 
      component: PokemonList, 
    },
    {
      path: '/pokemon/:url',
      redirect: '/pokemon/:url',
      component: () => import('../views/PokemonDetails.vue')
    },
    {
      path: '/pokemon/:url',
      name: 'PokemonDetails',
      component: () => import('../views/PokemonDetails.vue')
    }
  ]

})

export default router
