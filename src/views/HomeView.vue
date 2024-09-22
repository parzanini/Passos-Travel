<script setup>
	import InputText from "primevue/inputtext";
	import Calendar from "primevue/calendar";
	import Button from "primevue/button";
	import Textarea from "primevue/textarea";
	import Dialog from "primevue/dialog";
	import emailjs from "@emailjs/browser";
	import { ref, onMounted } from "vue";

	// Refs for form, dialog, and form data
	const formRef = ref(null);
	const showDialog = ref(false);
	const dialogMessage = ref("");
	const dialogTitle = ref("");

	// Form data object
	const formData = ref({
		user_name: "",
		user_email: "",
		user_phone: "",
		travel_dates: "",
		dream_trip: "",
	});

	// Function to send email using EmailJS
	const sendEmail = () => {
		emailjs
			.sendForm("service_hxo2n6e", "template_goc225a", formRef.value, {
				publicKey: "oTqhsu3S1LKieQE3C",
			})
			.then(
				() => {
					// Success handling
					dialogTitle.value = "Sucesso!";
					dialogMessage.value = "Mensagem enviada com sucesso! Agradecemos seu contato. Nossa equipe entrará em contato com você em breve para discutir sua viagem dos sonhos.";
					showDialog.value = true;
					// Reset form data after successful submission
					Object.keys(formData.value).forEach(key => formData.value[key] = "");
				},
				(error) => {
					// Error handling
					console.log("FAILED...", error.text);
					dialogTitle.value = "Erro";
					dialogMessage.value = "Desculpe, algo deu errado. Por favor, tente novamente mais tarde ou entre em contato conosco diretamente.";
					showDialog.value = true;
				}
			);
	};

	// Load Elfsight script for testimonials
	onMounted(() => {
		const script = document.createElement('script');
		script.src = 'https://static.elfsight.com/platform/platform.js';
		script.setAttribute('data-use-service-core', '');
		script.defer = true;
		document.head.appendChild(script);
	});
</script>

<template>
  <div class="bg-gray-100 text-gray-800 snap-y snap-mandatory overflow-y-scroll h-screen">
    <!-- Header Section -->
    <header class="bg-[#34446C] p-4 lg:sticky lg:top-0 z-40">
      <div class="container mx-auto flex flex-wrap justify-between items-center">
        <div class="flex items-center mb-2 sm:mb-0">
          <img src="/images/logo.png" alt="Passos Travel Logo" class="h-12 mr-4" />
          <div class="hidden sm:block text-white">
            <a href="mailto:passostravel@gmail.com" class="block hover:underline">passostravel@gmail.com</a>
            <a href="tel:+551146375629" class="block hover:underline">11 4637-5629</a>
          </div>
        </div>
        <div class="flex">
          <a href="https://www.facebook.com/profile.php?id=61563997826241" target="_blank" rel="noopener noreferrer" class="text-white mx-2"><i class="pi pi-facebook text-2xl"></i></a>
          <a href="https://www.instagram.com/passostravel/" target="_blank" rel="noopener noreferrer" class="text-white mx-2"><i class="pi pi-instagram text-2xl"></i></a>
          <a href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" class="text-white mx-2"><i class="pi pi-whatsapp text-2xl"></i></a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Welcome Section -->
      <section class="snap-start min-h-screen py-12 px-4 flex items-center">
        <div class="container mx-auto">
          <h1 class="text-3xl md:text-5xl font-bold text-center mb-4">Bem-vindo à Passos Travel!</h1>
          <h2 class="text-xl font-semibold mb-4 text-center lg:text-2xl">Transformando seus sonhos de viagem em realidade!</h2>
          <div class="flex flex-wrap items-center">
           
            <div class="w-full lg:w-2/5 mb-8 lg:mb-0">
              
              <p class="mb-3 mx-4 lg:text-xl">Na Passos Travel, oferecemos passagens aéreas, hotéis e pacotes de viagens para todas as suas necessidades. Nossa missão é proporcionar a melhor experiência de viagem com conforto, segurança e preços competitivos.</p>
              <p class="mb-3 mx-4 lg:text-xl">Conectamos você aos melhores destinos com tarifas competitivas e opções flexíveis. Encontre o hotel ideal para sua estadia, de pousadas a resorts. Criamos pacotes sob medida, combinando voos, hotéis e experiências únicas.</p>
              <p class="mb-3 mx-4 lg:text-xl">Viaje bem conosco e descubra como é fácil explorar o mundo!</p>
            </div>
            <div class="w-full lg:w-3/5 text-center">
              <img src="/images/design1.png" alt="Passos Travel Logo" class="w-full rounded-3xl p-4 max-w-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section class="snap-start min-h-screen py-12 px-4 bg-white flex items-center">
        <div class="container mx-auto">
          <div class="flex flex-wrap -mx-4">
            <div class="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
              <h2 class="text-2xl font-semibold mb-4 text-center lg:text-left">Entre em contato conosco para planejar sua próxima viagem!</h2>
              <p class="mb-4">Estamos ansiosos para ajudá-lo a planejar sua próxima viagem. Preencha o formulário e entraremos em contato com você em breve.</p>
              <p class="mb-4">Se preferir, entre em contato conosco por telefone ou Whatsapp. Estamos disponíveis para responder a todas as suas perguntas e ajudá-lo a encontrar a melhor opção de viagem para você.</p>
              <img src="/images/contact_us.gif" alt="Contact Us" class="w-full rounded-3xl p-4 max-w-full hidden lg:block">
            </div>
            <div class="w-full lg:w-2/3 px-4">
              <form class="bg-[#34446C] p-4 md:p-6 rounded-lg max-w-md mx-auto lg:max-w-none" ref="formRef" @submit.prevent="sendEmail">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-white text-sm mb-1" for="nome">Nome: *</label>
                    <InputText id="nome" name="user_name" v-model="formData.user_name" class="w-full text-sm" />
                  </div>
                  <div>
                    <label class="block text-white text-sm mb-1" for="email">Email: *</label>
                    <InputText id="email" name="user_email" v-model="formData.user_email" class="w-full text-sm" />
                  </div>
                  <div>
                    <label class="block text-white text-sm mb-1" for="telefone">Telefone: *</label>
                    <InputText id="telefone" name="user_phone" v-model="formData.user_phone" class="w-full text-sm" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-white text-sm mb-1" for="dates">Quais datas está pensando?</label>
                    <Calendar id="dates" name="travel_dates" v-model="formData.travel_dates" selectionMode="range" :manualInput="false" showIcon class="w-full text-sm" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-white text-sm mb-1" for="dream_trip">Descreve sua viagem dos sonhos!</label>
                    <Textarea id="dream_trip" name="dream_trip" v-model="formData.dream_trip" rows="3" class="w-full text-sm" />
                  </div>
                  <div class="md:col-span-2">
                    <Button label="Enviar" type="submit" class="w-full text-sm" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section with Footer -->
      <section class="snap-start min-h-screen flex flex-col justify-between bg-gray-100">
        <div class="container mx-auto py-4 px-4 lg:pt-8 my-16">
          <h2 class="text-2xl font-semibold mb-8 text-center">Depoimentos de nossos clientes</h2>
          <!-- Elfsight app for testimonials -->
          <div class="elfsight-app-43e3c865-1c1b-4603-95d9-5e3351d2075c" data-elfsight-app-lazy></div>
        </div>
       
        
        <!-- Footer Section -->
        <footer class="bg-[#34446C] text-white py-4">
          <div class="container mx-auto px-4">
            <div class="w-full sm:w-auto mb-4 sm:mb-2 text-center">
              <h3 class="font-semibold">Passos Travel</h3>
                <p class="text-sm font-semibold">Transformando sonhos em viagens!</p>
              </div>
            <div class="flex flex-wrap justify-between items-center text-sm">
              
              <div class="w-full sm:w-auto mb-2 sm:mb-0 flex justify-center">
                <a href="https://cadastur.turismo.gov.br/" target="_blank" rel="noopener noreferrer">
                <img src="/images/cadastur.png" alt="Cadasturr Logo" class="h-16 mr-4 rounded-full" />
                </a>
              </div>
              <div class=" w-full sm:w-auto mb-2 sm:mb-0 flex justify-center flex-col text-center">
                <h3 class="text-xs">CNPJ: 42.593.684/0001-01</h3>
                <p class="text-xs">Email: passostravel@gmail.com</p>
                <p class="text-xs">Tel: 11 4637-5629</p>
              </div>
              <div class="w-full sm:w-auto flex justify-center sm:justify-end">
                
                <a href="https://www.facebook.com/profile.php?id=61563997826241" target="_blank" rel="noopener noreferrer" class="mx-2"><i class="pi pi-facebook text-3xl"></i></a>
                <a href="https://www.instagram.com/passostravel/" target="_blank" rel="noopener noreferrer" class="mx-2"><i class="pi pi-instagram text-3xl"></i></a>
                <a href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" class="mx-2"><i class="pi pi-whatsapp text-3xl"></i></a>
              </div>
            </div>
            <div class="mt-2 text-center">
              <p class="text-xs">&copy; 2024 Passos Travel. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  </div>

  <!-- Dialog component for displaying success/error messages -->
  <Dialog v-model:visible="showDialog" :modal="true" :closable="false" :style="{ width: '90%', maxWidth: '400px' }">
    <template #header>
      <h3 class="text-xl font-semibold">{{ dialogTitle }}</h3>
    </template>
    <p>{{ dialogMessage }}</p>
    <template #footer>
      <Button label="OK" @click="showDialog = false" class="p-button-text" />
    </template>
  </Dialog>
</template>

<style scoped>
/* Styles for smooth scrolling and snap behavior */
html, body {
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
}

.snap-y {
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

/* Disable snap scrolling on mobile devices */
@media (max-width: 768px) {
  .snap-y {
    scroll-snap-type: none;
  }
  .snap-start {
    scroll-snap-align: none;
  }
  .min-h-screen {
    min-height: auto;
  }
}
</style>
