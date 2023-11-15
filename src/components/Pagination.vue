<template>
    <div class="paginationTotalArea">
        <li class="btnBox">
            <button @click="changePage(currentPage = 1)" :class="{'disabled': currentPage === 1}" class="btnPag" >Start</button>
            <button @click="changePage(currentPage - 1)" :class="{'disabled': currentPage === 1}" class="btnPag" >Previous</button>
            <button @click="changePage(currentPage + 1)" :class="{'disabled': currentPage === totalPages}" class="btnPag" >Next</button>
            <button @click="changePage(currentPage = totalPages)" :class="{'disabled': currentPage === totalPages}" class="btnPag" >End</button>
        </li>
        
        
    </div>
</template>

<script>
    export default {

        props: {
            currentPage: Number,
            totalPages: Number
        },

        computed:{
            visiblePages(){
                const range = 2
                const startPage = Math.max(1, this.currentPage - range);
                const endPage = Math.min(this.totalPages, this.currentPage + range)

                const pages = []
                for(let i = startPage; i <= endPage; i++){
                    pages.push(i)
                }

                return pages;
            }
        },

        methods: {
            changePage(newPage){
                if(newPage >= 1 && newPage <= this.totalPages){
                    this.$emit("updatePage", newPage)
                }
            }
        }
    }

</script>

<style scoped>
    .paginationTotalArea{
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top:30px;
    }

    .btnBox{
        display: flex;
        gap:2px;
    }

    .btnPag{
        background-color: #00043c75;
        width:60px;
        height: 40px;
        border: 1px solid gray;
        border-radius: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        cursor: pointer;
    }

    .disabled{
        display: none;
    }

    @media (min-width: 300px) and (max-width: 359px) {
    .btnPag{
        width: 30px;
        height: 30px;
        font-size: 10px;
    }
}
</style>