<template>

  <header class="mainBox">
      <div>
          <router-link :to="{ name: 'PokemonList'}" class="logoPath" href="#">
            <img class="pokedexLogo" src="./assets/img/logo.png" alt="Pokedex Logo" /> 
          </router-link>
      <div>
      </div>
    </div>
      
  </header>
  <main>
        <router-view></router-view>
  </main>

</template>


<style lang="scss">

  .mainBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top:15px; 

    .pokedexLogo{
      height:90px;
      width:270px; 
      vertical-align: middle;
    }

    @media (min-width: 300px) and (max-width: 439px){
    .pokedexLogo{
      width: 220px;
    }
  }
  }

  


</style>
