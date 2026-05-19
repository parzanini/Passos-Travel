<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import emailjs from "@emailjs/browser";

const route = useRoute();
const router = useRouter();

const currentLanguage = ref(route.params.lang || "en");
const content = ref({});
const formLabels = ref({
  name: "",
  email: "",
  phone: "",
  dates: "",
  dreamTrip: "",
  sendButton: "",
});

// Load language data from external files
const loadLanguageData = async (lang) => {
  try {
    const module = await import(`@/langData/${lang}.js`);
    content.value = module.default[lang];
    // Populate form labels specifically
    formLabels.value = {
      name: content.value.formLabels.name,
      email: content.value.formLabels.email,
      phone: content.value.formLabels.phone,
      dates: content.value.formLabels.dates,
      dreamTrip: content.value.formLabels.dreamTrip,
      sendButton: content.value.sendButton,
    };
  } catch (error) {
    console.error("Failed to load language data:", error);
    content.value = {}; // Set to empty object in case of error
  }
};

watch(
  () => route.params.lang,
  (newLang) => {
    currentLanguage.value = newLang || "en";
    loadLanguageData(currentLanguage.value);
  }
);

const changeLanguage = (lang) => {
  if (lang === "en") {
    router.push("/");
  } else {
    router.push(`/${lang}`);
  }
};

// Refs for dialog and form data
const showDialog = ref(false);
const dialogMessage = ref("");
const dialogTitle = ref("");

// Form data object
const formData = ref({
  user_name: "",
  user_email: "",
  user_phone: "",
  travel_dates: null,
  dream_trip: "",
});

const errors = ref({});

// Form security: honeypot + minimum interaction time + optional hCaptcha.
// hCaptcha is opt-in: only activates when VITE_HCAPTCHA_SITE_KEY is set
// AND hCaptcha is configured in the EmailJS dashboard.
const honeypot = ref("");
const formStartTime = ref(null);
const MIN_FORM_TIME_MS = 3000;
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "";
const hcaptchaToken = ref(null);

const trackFormStart = () => {
  if (!formStartTime.value) {
    formStartTime.value = Date.now();
  }
};

const validateForm = () => {
  errors.value = {};
  const v = content.value.validation || {};

  if (!formData.value.user_name.trim()) {
    errors.value.user_name = v.nameRequired;
  }

  if (!formData.value.user_email.trim()) {
    errors.value.user_email = v.emailRequired;
  } else if (!/\S+@\S+\.\S+/.test(formData.value.user_email)) {
    errors.value.user_email = v.emailInvalid;
  }

  if (!formData.value.user_phone.trim()) {
    errors.value.user_phone = v.phoneRequired;
  }

  if (!formData.value.travel_dates) {
    errors.value.travel_dates = v.datesRequired;
  }

  if (!formData.value.dream_trip.trim()) {
    errors.value.dream_trip = v.dreamTripRequired;
  }

  return Object.keys(errors.value).length === 0;
};

const formattedDates = computed(() => {
  if (!formData.value.travel_dates) return "";
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  if (Array.isArray(formData.value.travel_dates)) {
    return formData.value.travel_dates.map(formatDate).join(" to ");
  } else {
    return formatDate(formData.value.travel_dates);
  }
});

const sendEmail = () => {
  const d = content.value.dialog || {};
  const v = content.value.validation || {};

  // Honeypot: bots fill hidden fields. Silent-fail so we don't tip them off.
  if (honeypot.value) {
    return;
  }

  // Time guard: real users take longer than MIN_FORM_TIME_MS to fill the form.
  const elapsed = formStartTime.value ? Date.now() - formStartTime.value : 0;
  if (elapsed < MIN_FORM_TIME_MS) {
    return;
  }

  // hCaptcha: required only when configured. Surface a friendly error.
  if (HCAPTCHA_SITE_KEY && !hcaptchaToken.value) {
    dialogTitle.value = d.errorTitle;
    dialogMessage.value = v.captchaRequired || "Please complete the captcha.";
    showDialog.value = true;
    return;
  }

  if (!validateForm()) {
    return;
  }

  const params = {
    user_name: formData.value.user_name,
    user_email: formData.value.user_email,
    user_phone: formData.value.user_phone,
    travel_dates: formattedDates.value,
    dream_trip: formData.value.dream_trip,
  };
  if (hcaptchaToken.value) {
    // EmailJS expects the captcha token under this key for both reCAPTCHA and hCaptcha.
    params["g-recaptcha-response"] = hcaptchaToken.value;
  }

  emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      params,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(
      () => {
        dialogTitle.value = d.successTitle;
        dialogMessage.value = d.successMessage;
        showDialog.value = true;
        Object.keys(formData.value).forEach(
          (key) => (formData.value[key] = key === "travel_dates" ? null : "")
        );
        // Reset captcha + interaction tracking for the next submission
        hcaptchaToken.value = null;
        formStartTime.value = null;
        if (HCAPTCHA_SITE_KEY && window.hcaptcha) {
          window.hcaptcha.reset();
        }
      },
      () => {
        dialogTitle.value = d.errorTitle;
        dialogMessage.value = d.errorMessage;
        showDialog.value = true;
      }
    );
};

onMounted(() => {
  // Reviews widget (Fouita)
  const widgetScript = document.createElement("script");
  widgetScript.src = "https://cdn.fouita.com/widgets/0x1a4c2a.js";
  widgetScript.async = true;
  widgetScript.defer = true;
  document.head.appendChild(widgetScript);

  // hCaptcha: load only when configured
  if (HCAPTCHA_SITE_KEY) {
    const hcap = document.createElement("script");
    hcap.src = "https://js.hcaptcha.com/1/api.js";
    hcap.async = true;
    hcap.defer = true;
    document.head.appendChild(hcap);
    // Global callbacks invoked by the hCaptcha widget
    window.onHCaptchaSuccess = (token) => {
      hcaptchaToken.value = token;
    };
    window.onHCaptchaExpired = () => {
      hcaptchaToken.value = null;
    };
  }

  loadLanguageData(currentLanguage.value);
});
</script>
<template>
  <div
    class="bg-gray-100 text-gray-800 snap-y snap-proximity overflow-y-scroll h-dvh"
  >
    <section class="snap-start min-h-dvh flex flex-col flex-wrap">
      <!-- Header Section -->
      <div class="bg-[#34446C] p-2 md:p-4 w-full">
        <div class="mx-auto flex flex-wrap justify-between items-center">
          <div class="flex items-center mb-2 sm:mb-0">
            <img
              src="/images/logo.webp"
              alt="Passos Travel Logo"
              class="h-12 mr-4 max-w-full mt-1"
              width="85"
              height="48"
            />
            <div class="hidden sm:block text-white">
              <a
                href="mailto:passostravel@gmail.com"
                class="block hover:underline"
                aria-label="Email us at passostravel@gmail.com"
                >passostravel@gmail.com</a
              >
              <a
                href="tel:+551146375629"
                class="block hover:underline"
                aria-label="Call us at 11 4637-5629"
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
              aria-label="Visit our Facebook page"
              ><i class="pi pi-facebook text-2xl"></i
            ></a>
            <a
              href="https://www.instagram.com/passostravel/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white mx-2"
              aria-label="Visit our Instagram profile"
              ><i class="pi pi-instagram text-2xl"></i
            ></a>
            <a
              href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white mx-2"
              aria-label="Contact us on WhatsApp"
              ><i class="pi pi-whatsapp text-2xl"></i
            ></a>

            <a
              href="#"
              @click.prevent="changeLanguage('en')"
              class="text-white mx-2"
              aria-label="Switch to English"
              >EN</a
            >
            <a
              href="#"
              @click.prevent="changeLanguage('pt')"
              class="text-white mx-2"
              aria-label="Mudar para Português"
              >PT</a
            >
            <a
              href="#"
              @click.prevent="changeLanguage('es')"
              class="text-white mx-2"
              aria-label="Cambiar a Español"
              >ES</a
            >
          </div>
        </div>
      </div>

      <div
        class="mx-auto my-auto md:mx-6 px-3 md:px-4 flex flex-col justify-around min-h-screen-3/4"
      >
        <div>
          <h1
            class="text-3xl md:text-5xl font-bold text-center mb-3 md:mb-4 lg:p-4"
          >
            {{ content.title }}
          </h1>
        </div>
        <div>
          <h2
            class="text-xl font-semibold mb-3 md:mb-4 text-center md:text-3xl lg:p-4"
          >
            {{ content.subtitle }}
          </h2>
        </div>
        <div class="lg:flex lg:flex-row lg:items-center lg:p-8">
          <div class="lg:w-2/5 mb-4 md:mb-8 lg:mb-0">
            <p
              v-for="(paragraph, index) in content.description"
              :key="index"
              class="md:mb-3 md:mx-4 mb-4 mx-2 md:text-xl"
            >
              {{ paragraph }}
            </p>
          </div>
          <div class="lg:w-3/5 lg:flex lg:justify-center">
            <img
              src="/images/design.webp"
              alt="Travel destinations collage"
              class="rounded-3xl md:p-4 p-2 max-w-full"
              width="800"
              height="400"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section
      class="snap-start min-h-dvh py-4 md:py-12 px-3 md:px-4 bg-white flex items-center"
    >
      <div class="container mx-auto">
        <div class="flex flex-wrap mx-4">
          <div class="w-full lg:w-1/3 px-4 md:mb-8 mb-2 lg:mb-0">
            <h2 class="text-2xl font-semibold mb-4 text-center lg:text-left">
              {{ content.contactTitle }}
            </h2>
            <p class="mb-4 md:text-xl">
              {{ content.contactDescription }}
            </p>
            <p class="hidden md:block md:text-xl">
              {{ content.contactAlternative }}
            </p>
            <video
              src="/images/contact_us.webm"
              alt="Contact us illustration"
              class="rounded-3xl md:p-4 md:max-w-full hidden lg:block"
              width="400"
              height="300"
              autoplay
              muted
              loop
            ></video>
          </div>
          <div class="w-full lg:w-2/3 md:px-4">
            <form
              class="bg-[#34446C] p-4 md:p-6 rounded-lg max-w-md mx-auto lg:max-w-none relative"
              @submit.prevent="sendEmail"
              @input="trackFormStart"
              @focusin="trackFormStart"
              aria-label="Contact form"
              novalidate
            >
              <!-- Honeypot: hidden from humans, bots fill it. Do not remove. -->
              <div
                aria-hidden="true"
                class="overflow-hidden"
                style="position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px;"
              >
                <label for="company">Do not fill this field</label>
                <input
                  id="company"
                  type="text"
                  v-model="honeypot"
                  name="company"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-white text-sm mb-1" for="nome">{{
                    formLabels.name
                  }}</label>
                  <InputText
                    id="nome"
                    v-model="formData.user_name"
                    class="w-full text-sm"
                    :class="{ 'p-invalid': errors.user_name }"
                    aria-required="true"
                  />
                  <small class="p-error" v-if="errors.user_name">{{
                    errors.user_name
                  }}</small>
                </div>
                <div>
                  <label class="block text-white text-sm mb-1" for="email">{{
                    formLabels.email
                  }}</label>
                  <InputText
                    id="email"
                    v-model="formData.user_email"
                    class="w-full text-sm"
                    :class="{ 'p-invalid': errors.user_email }"
                    aria-required="true"
                  />
                  <small class="p-error" v-if="errors.user_email">{{
                    errors.user_email
                  }}</small>
                </div>
                <div>
                  <label class="block text-white text-sm mb-1" for="telefone">{{
                    formLabels.phone
                  }}</label>
                  <InputText
                    id="telefone"
                    v-model="formData.user_phone"
                    class="w-full text-sm"
                    :class="{ 'p-invalid': errors.user_phone }"
                    aria-required="true"
                  />
                  <small class="p-error" v-if="errors.user_phone">{{
                    errors.user_phone
                  }}</small>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-white text-sm mb-1" for="dates">{{
                    formLabels.dates
                  }}</label>
                  <Calendar
                    id="dates"
                    v-model="formData.travel_dates"
                    selectionMode="range"
                    :manualInput="false"
                    showIcon
                    class="w-full text-sm"
                    :class="{ 'p-invalid': errors.travel_dates }"
                  />
                  <small class="p-error" v-if="errors.travel_dates">{{
                    errors.travel_dates
                  }}</small>
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-white text-sm mb-1"
                    for="dream_trip"
                    >{{ formLabels.dreamTrip }}</label
                  >
                  <Textarea
                    id="dream_trip"
                    v-model="formData.dream_trip"
                    class="w-full text-sm md:mobile-one-row"
                    :class="{ 'p-invalid': errors.dream_trip }"
                    rows="3"
                  />
                  <small class="p-error" v-if="errors.dream_trip">{{
                    errors.dream_trip
                  }}</small>
                </div>
                <!-- hCaptcha widget: renders only when VITE_HCAPTCHA_SITE_KEY is set -->
                <div
                  v-if="HCAPTCHA_SITE_KEY"
                  class="md:col-span-2 flex justify-center"
                >
                  <div
                    class="h-captcha"
                    :data-sitekey="HCAPTCHA_SITE_KEY"
                    data-callback="onHCaptchaSuccess"
                    data-expired-callback="onHCaptchaExpired"
                    data-theme="dark"
                  ></div>
                </div>
                <div class="md:col-span-2">
                  <Button
                    :label="formLabels.sendButton"
                    type="submit"
                    class="w-full text-sm"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section with Footer -->
    <section
      class="snap-start min-h-dvh flex flex-col justify-between bg-gray-100 my-auto"
    >
      <div class="container mx-auto md:py-4 px-4 lg:pt-8 my-8">
        <h2 class="text-2xl font-semibold mb-8 text-center">
          {{ content.testimonialTitle }}
        </h2>
        <div data-key="All-in-one Reviews Grid" class="ft" id="ftf20f18u"></div>
      </div>
      <!-- Footer Section -->
      <footer class="bg-[#34446C] text-white py-2">
        <div class="container mx-auto px-4">
          <div class="w-full sm:w-auto mb-4 sm:mb-2 text-center">
            <h3 class="font-semibold">Passos Travel</h3>
            <p class="text-sm font-semibold">{{ content.footerText }}</p>
          </div>
          <div class="flex flex-wrap justify-between items-center text-sm">
            <div class="w-full sm:w-auto mb-2 sm:mb-0 flex justify-center">
              <a
                href="https://cadastur.turismo.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Cadastur website"
              >
                <img
                  src="/images/cadastur.webp"
                  alt="Cadastur Logo"
                  class="h-14 md:h-16 md:mr-4 rounded-full"
                  width="128"
                  height="64"
                />
              </a>
            </div>
            <div
              class="w-full sm:w-auto mb-2 sm:mb-0 flex justify-center flex-col text-center"
            >
              <h3 class="text-xs">CNPJ: 42.593.684/0001-01</h3>
              <p class="text-xs">Email: atendimento@passostravel.com</p>
              <p class="text-xs">Tel: 11 4637-5629</p>
            </div>
            <div class="w-full sm:w-auto flex justify-center">
              <a
                href="https://www.facebook.com/profile.php?id=61563997826241"
                target="_blank"
                rel="noopener noreferrer"
                class="mx-2"
                aria-label="Visit our Facebook page"
                ><i class="pi pi-facebook text-3xl"></i
              ></a>
              <a
                href="https://www.instagram.com/passostravel/"
                target="_blank"
                rel="noopener noreferrer"
                class="mx-2"
                aria-label="Visit our Instagram profile"
                ><i class="pi pi-instagram text-3xl"></i
              ></a>
              <a
                href="https://api.whatsapp.com/send/?phone=551146375629&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                class="mx-2"
                aria-label="Contact us on WhatsApp"
                ><i class="pi pi-whatsapp text-3xl"></i
              ></a>
            </div>
          </div>
          <div class="mt-2 text-center">
            <p class="text-xs">
              &copy; 2024 Passos Travel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  </div>

  <!-- Dialog component for displaying success/error messages -->
  <Dialog
    v-model:visible="showDialog"
    :modal="true"
    :closable="false"
    :style="{ width: '90%', maxWidth: '400px' }"
    aria-label="Dialog for displaying messages"
  >
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
html,
body {
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
}

.snap-start {
  scroll-snap-align: start;
}

.mobile-one-row {
  height: 3em;
  /* Approximate height of one row */
}

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
}

.p-invalid {
  border-color: #ef4444 !important;
}
</style>
