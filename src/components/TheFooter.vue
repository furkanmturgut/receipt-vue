<template>
    <div class="footer">
        <footer>
            <!-- START Social Media -->
            <!-- START Social Media -->

            <div class="social">
                <h3>Sosyal Ağlar</h3>
                <div class="socialMedia">
                    <a href="#" target="_blank"></a>
                    <i class="pi pi-instagram"> Instagram</i>
                </div>
                <div class="socialMedia">
                    <a href="#" target="_blank"></a>
                    <i class="pi pi-facebook"> Facebook</i>
                </div>
                <div class="socialMedia">
                    <a href="#" target="_blank"></a>
                    <i class="pi pi-linkedin"> Linkedin</i>
                </div>
                <div class="socialMedia">
                    <a href="#" target="_blank"></a>
                    <i class="pi pi-globe"> Web Sitemiz</i>
                </div>

            </div>
            <!-- END Social Media -->
            <!-- END Social Media  -->

            <!-- START Contact -->
            <!-- START Contact -->

            <div class="contact">
                <h3>İletişim</h3>
                <div class="contactList">
                    <a href="#"><i class="pi pi-phone"> 555-555-5555</i></a>
                </div>

                <div class="contactList">
                    <a href="#"><i class="pi pi-envelope"> deneme@deneme.com</i></a>
                </div>

                <div class="contactList">
                    <a href="#"><i class="pi pi-map-marker"> Teknopark</i></a>
                </div>
            </div>

            <!-- END Contact -->
            <!-- END Contact -->


        </footer>
    </div>
</template>

<script scoped>
export default {

}
</script>

<style scoped>
img {
    width: 150px;
    height: 50px;
}

h3 {
    font-size: 16px;
    margin-bottom: 6px;
    color: #FFAC1C;
}

footer {
    width: 100%;
    height: 200px;
    gap: 15px;
    flex-direction: row;
    display: flex;
    background: #317d7aff
}

.social {
    position: absolute;
    right: 10%;
    
}
.socialMedia {
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: row;
    height: 25px;

}

a {
    text-decoration: none;
    color: #fff;   
}

i {
    color: #fff;
    cursor: pointer;
    margin: 5px;
    font-size: 15px;
    vertical-align: middle;
}

i:hover {
    color: #FFAC1C;
}
.contact{
    position: absolute;
    right: 25%;
}

</style>