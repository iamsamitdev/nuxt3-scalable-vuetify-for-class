<script setup lang="ts">

import useStrapiApi from "@/composables/useStrapiApi"

// get token from cookie
const token = useCookie('token')

 // headers
 const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token.value}`
}

// form data
const title = ref('')
const slug = ref('')
const description = ref('')
const image = ref<File | null>(null)
const price = ref(0)
const qty = ref(0)
const category = ref('')
const categoryList = ref([] as any)

// get category list from api in mounted
onMounted(async () => {
  try {
    const response: any = await useStrapiApi().getCategories().then((res) => res.data);

    // console.log(response.value.data)
    // push data to categoryList
    response.value.data.forEach((item: any) => {
        categoryList.value.push({
            name: item.attributes.title,
            id: item.id
        })
    })
    
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
})


// const categoryList = ref([
//     { name: 'Cloth', id: '1'}, 
//     {name: 'Electronic', id:'2'}, 
//     {name:'Mom & Kid', id:'3'}]
// )

// for image preview
const files: any = ref([])
const imageUrl = ref<string | null>(null)

// handle file change
const handleFileChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    const reader = new FileReader()
    reader.onload = (e) => {
        imageUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file!);

    image.value = files.value[0]
}

// remove image
const removeImage = () => {
    imageUrl.value = null
}


// Form Validation =====================================
 const titleRules = ref([
    (v: string) => !!v || "Title is required",
    (v: string) => (v && v.length >= 5) || "Title must be at least 5 characters",
  ])

  const slugRules = ref([
    (v: string) => !!v || "Slug is required",
    (v: string) => (v && v.length >= 5) || "Slug must be at least 5 characters",
  ])

  const priceRules = ref([
    (v: string) => !!v || "Price is required",
    (v: string) => (v && v.length >= 1) || "Price must be at least 1 characters",
  ])

  const qtyRules = ref([
    (v: string) => !!v || "Qty is required",
    (v: string) => (v && v.length >= 1) || "Qty must be at least 1 characters",
  ])

  const categoryRules = ref([
    (v: string) => !!v || "Category is required",
  ])
// =====================================================

// submit form  ========================================
const submitForm = async () => {
    // Check form validation
    if (!title.value || !slug.value || !price.value || !qty.value || !category.value) {
      return
    }else{
        const formData = new FormData();
        const data = {
            title: title.value,
            slug: slug.value,
            description: description.value,
            price: price.value,
            qty: qty.value,
            category: category.value
        };

        formData.append('data', JSON.stringify(data));

        // console.log(data)

        if (image.value) {
            formData.append('files.image', image.value!);
        }

        const { data: createRes } = useFetch('http://localhost:1337/api/products', {
            method: 'POST',
            body: formData,
            headers: headers,
        })

        console.log('createProductRes', createRes);
    }
}
// =====================================================

</script>

<template>
    <v-container>
        <v-form fast-fail @submit.prevent="submitForm">
            <v-row>
                <v-col cols="12" sm="6">
                    <v-col cols="12" sm="12">
                        <v-text-field
                            v-model="title"
                            :rules="titleRules"
                            hide-details="auto"
                            label="Title"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-text-field
                            v-model="slug"
                            :rules="slugRules"
                            hide-details="auto"
                            label="Slug"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-textarea
                            v-model="description"
                            variant="outlined"
                            hide-details="auto"
                            label="Description"
                            rows="3"
                        ></v-textarea>
                    </v-col> 
                </v-col>

                <v-col cols="12" sm="6">
                    <v-col cols="12" sm="12">
                        <v-img v-if="imageUrl" :src="imageUrl">
                            <v-btn icon @click="removeImage">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-img>

                        <v-file-input
                            @change="handleFileChange"
                            v-model="files"
                            label="Image"
                            prepend-icon="mdi-image"
                            outlined
                            dense
                            hide-details="auto"
                            accept="image/*"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-text-field
                            v-model="price"
                            :rules="priceRules"
                            hide-details="auto"
                            label="Price"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-text-field
                            v-model="qty"
                            :rules="qtyRules"
                            hide-details="auto"
                            label="Qty"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-select
                            v-model="category"
                            :rules="categoryRules"
                            :items="categoryList"
                            item-title="name"
                            item-value="id"
                            hide-details="auto"
                            label="Category"
                            variant="outlined"
                        ></v-select>
                    </v-col>
                </v-col>
            </v-row>
            <v-card-actions class="pl-3">
                <v-btn
                    color="secondary"
                    size="large"
                    variant="elevated"
                    type="submit"
                >Submit</v-btn>
            </v-card-actions>
        </v-form>
    </v-container>
</template>

<style scoped>
.v-img {
  position: relative; /* Allow absolute positioning of child elements */
  height: 200px; /* Set a fixed height */
}

.v-img .v-btn {
  position: absolute;
  top: 0; /* Place at the top edge */
  right: 0; /* Place at the right edge */
  margin: 5px; /* Add some spacing from the edges */
}
</style>