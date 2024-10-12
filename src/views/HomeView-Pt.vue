<script setup>
	import InputText from "primevue/inputtext";
	import Calendar from "primevue/calendar";
	import Button from "primevue/button";
	import Textarea from "primevue/textarea";
	import Dialog from "primevue/dialog";
	import emailjs from "@emailjs/browser";
	import { ref, onMounted } from "vue";

	// Referências para o formulário, diálogo e dados do formulário
	const formRef = ref(null);
	const showDialog = ref(false);
	const dialogMessage = ref("");
	const dialogTitle = ref("");

	// Objeto de dados do formulário
	const formData = ref({
		user_name: "",
		user_email: "",
		user_phone: "",
		travel_dates: "",
		dream_trip: "",
	});

	// Função para enviar e-mail usando EmailJS
	const sendEmail = () => {
		emailjs
			.sendForm("service_hxo2n6e", "template_goc225a", formRef.value, {
				publicKey: "oTqhsu3S1LKieQE3C",
			})
			.then(
				() => {
					// Sucesso no envio
					dialogTitle.value = "Sucesso!";
					dialogMessage.value =
						"Mensagem enviada com sucesso! Agradecemos o seu contato. Nossa equipe entrará em contato em breve para discutir sua viagem dos sonhos.";
					showDialog.value = true;
					// Redefinir os dados do formulário após o envio bem-sucedido
					Object.keys(formData.value).forEach(
						(key) => (formData.value[key] = "")
					);
				},
				(error) => {
					// Erro no envio
					console.log("FALHA...", error.text);
					dialogTitle.value = "Erro";
					dialogMessage.value =
						"Desculpe, algo deu errado. Tente novamente mais tarde ou entre em contato conosco diretamente.";
					showDialog.value = true;
				}
			);
	};

	// Carregar o script do Elfsight para depoimentos
	onMounted(() => {
		const script = document.createElement("script");
		script.src = "https://static.elfsight.com/platform/platform.js";
		script.setAttribute("data-use-service-core", "");
		script.defer = true;
		document.head.appendChild(script);
	});
</script>

<template>
	<div
		class="bg-gray-100 text-gray-800 snap-y snap-mandatory overflow-y-scroll h-dvh">
		<section class="snap-start min-h-dvh flex flex-col flex-wrap">
			<!-- Seção de Cabeçalho -->
			<div class="bg-[#34446C] p-2 md:p-4 w-full">
				<div class="mx-auto flex flex-wrap justify-between items-center">
					<div class="flex items-center mb-2 sm:mb-0">
						<img
							src="/images/logo.webp"
							alt="Logotipo da Passos Travel"
							class="h-12 mr-4 max-w-full mt-1"
							width="85"
							height="48" />
						<div class="hidden sm:block text-white">
							<a
								href="mailto:passostravel@gmail.com"
								class="block hover:underline"
								aria-label="Envie um e-mail para passostravel@gmail.com"
								>passostravel@gmail.com</a
							>
							<a
								href="tel:+551146375629"
								class="block hover:underline"
								aria-label="Ligue para 11 4637-5629"
								>11 4637-5629</a
							>
						</div>
					</div>
					<div class="flex">
						<a
							href="https://www.facebook.com/profile.php?id=61563997826241"
							target="_blank"
							rel="noopener noreferrer"
							class="text-white mx-2"
							aria-label="Visite nossa página no Facebook">
							<i class="pi pi-facebook text-2xl"></i>
						</a>
						<a
							href="https://www.instagram.com/passostravel/"
							target="_blank"
							rel="noopener noreferrer"
							class="text-white mx-2"
							aria-label="Visite nosso perfil no Instagram">
							<i class="pi pi-instagram text-2xl"></i>
						</a>
						<a
							href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0"
							target="_blank"
							rel="noopener noreferrer"
							class="text-white mx-2"
							aria-label="Entre em contato pelo WhatsApp">
							<i class="pi pi-whatsapp text-2xl"></i>
						</a>
						<a
							href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0"
							target="_blank"
							rel="noopener noreferrer"
							class="text-white mx-2"
							aria-label="Português"
							>Português</a
						>
						<a
							href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0"
							target="_blank"
							rel="noopener noreferrer"
							class="text-white mx-2"
							aria-label="Espanhol"
							>Espanhol</a
						>
					</div>
				</div>
			</div>

			<div
				class="mx-auto md:mx-6 px-3 md:px-4 flex flex-col justify-around min-h-screen-3/4">
				<div>
					<h1
						class="text-3xl md:text-5xl font-bold text-center mb-3 md:mb-4 lg:p-4">
						Bem-vindo à Passos Travel!
					</h1>
				</div>
				<div>
					<h2
						class="text-xl font-semibold mb-3 md:mb-4 text-center md:text-3xl lg:p-4">
						Transformando seus sonhos de viagem em realidade!
					</h2>
				</div>
				<div class="lg:flex lg:flex-row lg:items-center lg:p-8">
					<div class="lg:w-2/5 mb-4 md:mb-8 lg:mb-0">
						<p class="md:mb-3 md:mx-4 mb-4 mx-2 md:text-xl">
							Na Passos Travel, oferecemos passagens aéreas, hotéis e pacotes de
							viagem para todas as suas necessidades. Nossa missão é
							proporcionar a melhor experiência de viagem com conforto,
							segurança e preços competitivos.
						</p>
						<p class="md:mb-3 md:mx-4 mb-4 mx-2 md:text-xl">
							Conectamos você aos melhores destinos com tarifas competitivas e
							opções flexíveis. Encontre o hotel ideal para sua estadia, desde
							pousadas até resorts. Criamos pacotes sob medida, combinando voos,
							hotéis e experiências únicas.
						</p>
						<p class="md:mb-3 md:mx-4 mb-4 mx-2 md:text-xl">
							Viaje bem conosco e descubra como é fácil explorar o mundo!
						</p>
					</div>
					<div class="lg:w-3/5 lg:flex lg:justify-center">
						<img
							src="/images/design1.webp"
							alt="Colagem de destinos de viagem"
							class="rounded-3xl md:p-4 p-2 max-w-full"
							width="800"
							height="400" />
					</div>
				</div>
			</div>
		</section>

		<!-- Seção de Formulário de Contato -->
		<section
			class="snap-start min-h-dvh py-4 md:py-12 px-3 md:px-4 bg-white flex items-center">
			<div class="container mx-auto">
				<div class="flex flex-wrap mx-4">
					<div class="w-full lg:w-1/3 px-4 md:mb-8 mb-2 lg:mb-0">
						<h2 class="text-2xl font-semibold mb-4 text-center lg:text-left">
							Entre em contato para planejar sua próxima viagem!
						</h2>
						<p class="mb-4 md:text-xl">
							Estamos ansiosos para ajudá-lo a planejar sua próxima viagem.
							Preencha o formulário e entraremos em contato em breve.
						</p>
						<p class="hidden md:block md:text-xl">
							Se preferir, entre em contato por telefone ou WhatsApp. Estamos à
							disposição para responder suas perguntas e ajudá-lo a encontrar a
							melhor opção de viagem para você.
						</p>
						<img
							src="/images/contact_us.gif"
							alt="Ilustração de entre em contato"
							class="rounded-3xl md:p-4 md:max-w-full hidden lg:block"
							width="400"
							height="300" />
					</div>
					<div class="w-full lg:w-2/3 md:px-4">
						<form
							class="bg-[#34446C] p-4 md:p-6 rounded-lg max-w-md mx-auto lg:max-w-none"
							ref="formRef"
							@submit.prevent="sendEmail"
							aria-label="Formulário de contato">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="md:col-span-2">
									<label
										class="block text-white text-sm mb-1"
										for="nome"
										>Nome: *</label
									>
									<InputText
										id="nome"
										name="user_name"
										v-model="formData.user_name"
										class="w-full text-sm"
										aria-required="true" />
								</div>

								<div>
									<label
										class="block text-white text-sm mb-1"
										for="email"
										>Email: *</label
									>
									<InputText
										id="email"
										name="user_email"
										v-model="formData.user_email"
										class="w-full text-sm"
										aria-required="true" />
								</div>
								<div>
									<label
										class="block text-white text-sm mb-1"
										for="telefone"
										>Telefone: *</label
									>
									<InputText
										id="telefone"
										name="user_phone"
										v-model="formData.user_phone"
										class="w-full text-sm"
										aria-required="true" />
								</div>
								<div>
									<label
										class="block text-white text-sm mb-1"
										for="datas"
										>Datas de Viagem:</label
									>
									<Calendar
										id="datas"
										name="travel_dates"
										v-model="formData.travel_dates"
										class="w-full text-sm"
										dateFormat="dd/mm/yy"
										showIcon="true"
										aria-required="false" />
								</div>
								<div class="md:col-span-2">
									<label
										class="block text-white text-sm mb-1"
										for="destino"
										>Viagem dos Sonhos:</label
									>
									<Textarea
										id="destino"
										name="dream_trip"
										v-model="formData.dream_trip"
										class="w-full text-sm"
										rows="4"
										aria-required="false" />
								</div>
							</div>

							<div class="flex justify-center mt-4">
								<Button
									type="submit"
									label="Enviar"
									class="bg-[#FFAD1B] text-[#34446C] text-lg py-2 px-6 cursor-pointer hover:bg-[#34446C] hover:text-white"
									aria-label="Enviar formulário" />
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>

		<!-- Diálogo de Sucesso ou Erro -->
		<Dialog
			v-model="showDialog"
			:header="dialogTitle"
			class="text-center">
			<p class="my-3">{{ dialogMessage }}</p>
			<Button
				label="OK"
				class="bg-[#FFAD1B] text-[#34446C] cursor-pointer hover:bg-[#34446C] hover:text-white"
				@click="showDialog = false" />
		</Dialog>
	</div>
</template>
