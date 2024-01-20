<script setup lang="ts">

	useHead({
		title: 'เข้าสู่ระบบ',
		meta: [
		{ 
			name: 'description', 
			content: 'เข้าสู่ระบบ Nuxt 3, IT Genius Engineering' 
		},
		{
			name: 'keywords',
			content: 'เข้าสู่ระบบ, Nuxt 3, Learning Nuxt 3'
		},
		],
	})

	// sweetalert2
	const { $swal } = useNuxtApp()

	// ref const for email and password
	const email = ref('')
	const password = ref('')

	// token for cookie
	const token = useCookie('token', {
		maxAge: 60 * 60 * 48, // maxAge is a relative value this the cookie will expire 1 (3600 second) hour after it's created.
		// expires: new Date(Date.now() + 60 * 60 * 24 * 7), // expires is a absolute value that determines the exact date and time when the cookie should expire For example, setting expires to new Date('2023-02-28T12:00:00Z') means that the cookie will expire on February 28th, 2023 at 12:00:00 PM UTC.
		// In general, it's recommended to use maxAge instead of expires because maxAge is more flexible and easier to use. With maxAge, you can simply set the number of seconds from the current time that the cookie should be valid, without having to calculate an exact expiration date
	})

	// useFormRules() for email and password
	const { ruleEmail, rulePassLen, ruleRequired } = useFormRules()

	// useRoute() for redirect
	const router = useRouter()

	// submit form
	const submit = async () => {

		// check form is valid
		if(ruleRequired(email.value) == true && ruleEmail(email.value) == true && rulePassLen(password.value) == true) {

			// console.log(email.value, password.value)	

			// if(email.value == 'admin@email.com' || password.value == '123456') {
			// 	// redirect to dashboard
			// 	await router.push({path:'/dashboard'})
			// }else {
			// 	// show error message
			// 	console.log('invalid email or password')
			// }
			
			const config = useRuntimeConfig();
    		const STRAPI_URL: string = config.strapi.url;

			// login strapi with useFetch()
			const { data, error } = await useFetch(`${STRAPI_URL}/auth/local`, {
				method: 'POST',
				body: JSON.stringify({
					"identifier": email.value,
					"password": password.value
				})
			})

			// check error
			if (error.value != null) {
				if ( (error as { value: { status: number } }).value.status === 400) {
					// Handle the 400 Bad Request error
					console.error('Bad Request:', (error as { value: { message: string } }).value.message)
					$swal.fire({
						title: 'มีข้อผิดพลาด',
						text: 'อีเมล์หรือรหัสผ่านไม่ถูกต้อง',
						icon: 'error',
						confirmButtonText: 'ปิดหน้าต่าง'
					})
				} else {
					// Handle other types of errors
					console.error('Request failed:', (error as { value: { message: string } }).value.message)
				}
			}else{ // if no error
				// console.log((data as { value: { jwt: string } }).value.jwt);
				let timerInterval: any
				$swal.fire({
					title: 'กำลังเข้าสู่ระบบ',
					html: 'กรุณารอสักครู่ <b></b> วินาที',
					timer: 3000,
					timerProgressBar: true,
					didOpen: () => {
						$swal.showLoading()
						timerInterval = setInterval(() => {
						const content = $swal.getHtmlContainer()
						if (content) {
							const b = content.querySelector('b')
							if (b) {
								b.textContent =$swal.getTimerLeft() / 1000
							}
						}
						}, 100)
					},
					willClose: () => {
						clearInterval(timerInterval)
					}
				}).then( async (result: any) => {
					if(result.dismiss === $swal.DismissReason.timer) {
						
						// set token to localstorage
						// localStorage.setItem('token', (data as { value: { jwt: string } }).value.jwt)

						// set token to cookie
						token.value = (data as { value: { jwt: string } }).value.jwt
						
						// redirect to home page
						// window.location.href = '/backend/dashboard'  
						await router.push({path:'/backend/dashboard'})
					}
				})
			}

		}
		
	}

	
</script>

<template>
	<VContainer fluid class="fill-height pa-0">
		<VRow no-gutters align="center" justify="center" class="fill-height">
            <VCol class="hidden-sm-and-down fill-height" md="6" lg="6">
				<VImg
					src="https://wallpaper.dog/large/5557744.jpg"
					cover
					class="h-100 rounded-xl rounded-ts-0 rounded-bs-0 d-flex align-center justify-center"
				>
					<div class="text-center w-50 text-white mx-auto">
						<h1 class="mb-4">ยินดีต้อนรับ</h1>
						<p>
							ยินดีต้อนรับสู่ระบบจัดการสินค้า ขอเชิญคุณเข้าสู่ระบบเพื่อสัมผัสประสบการณ์การจัดการสินค้าที่สะดวกรวดเร็วและแม่นยำ เริ่มการทำงานของคุณได้วันนี้ พร้อมกับเรา!
						</p>
					</div>
				</VImg>
			</VCol>
			<VCol cols="12" md="6" lg="6" sm="6">
				<VRow no-gutters align="center" justify="center">
					<VCol cols="12" md="6" class="pa-3">
						<h1>เข้าสู่ระบบ</h1>
						<p class="text-medium-emphasis">ป้อนอีเมล์และรหัสผ่านสำหรับเข้าใช้งาน</p>

						<VForm @submit.prevent="submit" class="mt-7">
							<div class="mt-1">
								<label class="label text-grey-darken-2" for="email">Email</label>
								<VTextField
									:rules="[ruleRequired, ruleEmail]"
									v-model="email"
									prepend-inner-icon="fluent:mail-24-regular"
									id="email"
									name="email"
									type="email"
								/>
							</div>
							<div class="mt-1">
								<label class="label text-grey-darken-2" for="password">Password</label>
								<VTextField
									:rules="[ruleRequired, rulePassLen]"
									v-model="password"
									prepend-inner-icon="fluent:password-20-regular"
									id="password"
									name="password"
									type="password"
								/>
							</div>
							<div class="mt-5">
								<VBtn type="submit" block min-height="44" class="gradient primary">Sign In</VBtn>
							</div>
						</VForm>
						<p class="text-center mt-10">
							<span
								>ยังไม่ได้เป็นสมาชิก ?
								<NuxtLink to="/signup" class="font-weight-bold text-primary"
									>ลงทะเบียนที่นี่</NuxtLink
								></span
							>
						</p>
					</VCol>
				</VRow>
			</VCol>

		</VRow>
	</VContainer>
</template>

<style scoped>

</style>