<template>

  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between mt-5 mb-3">
        <h4 class="display-4">Products</h4>
        <div>
          <button class="btn btn-primary" @click="newProduct">
            <i class="bx bxs-plus-circle"></i>
            Add Product
          </button>
          <vs-dialog blur :loading="productModal.loading" v-model="productModal.show"
                     @close="productModal.show = false">
            <template #header>
              <h4 class="not-margin">
                <b>{{product.id ? 'Edit' : 'Add'}}</b> Product
              </h4>
            </template>

            <div class="con-form mt-3">
              <div class="form-group mb-5">
                <vs-input block label="Name" v-model="product.name"></vs-input>
              </div>

              <div class="form-group mb-5">
                <vs-input block label="Description" type="textarea" v-model="product.description"></vs-input>
              </div>

              <div class="form-group">
                <vs-input block label="Bottles per point"
                          type="number"
                          v-model.number="product.units_per_point"></vs-input>
              </div>

              <div class="form-group">
                <image-upload-input v-model="product.image"
               ></image-upload-input>
              </div>
            </div>

            <template #footer>
              <div class="footer-dialog">
                <vs-button @click="save" :loading="productModal.loading"
                           :active-disabled="productModal.loading" block>
                  Submit
                </vs-button>
              </div>
            </template>
          </vs-dialog>
        </div>
      </div>
      <div class="table-responsive card card-body">
        <table class="table table-hover table-condensed table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Name</th>
            <th>Desc.</th>
            <th>Bottles/Pt</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>{{index + 1}}</td>
            <td>
              <vs-avatar size="45">
                <img :src="product.image" style="object-fit: cover; object-position: center">
              </vs-avatar>
            </td>
            <td>{{product.name}}</td>
            <td>{{product.description}}</td>
            <td>{{product.units_per_point | number}}</td>
            <td>
              <div class="d-flex">
                <vs-button dark @click="editProduct(product)" size="small">
                  <i class="bx bxs-edit"></i>
                  Edit
                </vs-button>
                <vs-button danger @click="deleteProduct(product)" size="small">
                  <i class="bx bxs-trash"></i>
                  Delete
                </vs-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script>
import ImageUploadInput from "@/components/inputs/ImageUploadInput";
export default {
  name: "index",
  components: {ImageUploadInput},
  layout: "app",
  data(){
    return {
      products: [],
      productModal: {
        show: false,
        loading: false,
      },
      product: {
        id: null,
        name: null,
        image: null,
        description: null,
        units_per_point: null,
        published: false,
      }
    }
  },
  async fetch(){
    await this.getProducts();
  },
  methods: {
    async getProducts(){
      await this.$doTask(async ()=> {
        const response = await this.$axios.get('products');
        this.products = response.data;
      }, 'Loading...');
    },
    async save(){
      this.productModal.loading = true;

      try {
        // const formData = this.$payloadToFormData(_.clone(this.product));
        const formData = {...this.product}

        if(this.product.id){
          const response = await this.$axios.put(`products/${this.product.id}`, formData);
          this.updateProduct(response.data.id, response.data);
        }else{
          const response = await this.$axios.post('products', formData);
          this.products.push(response.data);
        }

        this.$vs.notification({
          title: 'Success',
          text: 'Product was saved.',
          color: 'success',
          position: 'top-center'
        });

      } catch (e){

      }

      this.productModal.loading = false;
      this.productModal.show = false;
    },
    reset(){
      this.product = {
        id: null,
        name: null,
        image: null,
        description: null,
        units_per_point: null,
        published: false,
      }
    },
    updateProduct(id, data){
      let index = _.findIndex(this.products, prod => prod.id === id);
      this.products[index] = data;
    },
    newProduct(){
      this.reset();
      this.productModal.show = true;
    },
    editProduct(product){
      this.product = product;
      this.productModal.show = true;
    },
    async deleteProduct(product){
      if (!confirm('Are you sure?')) return;

      await this.$doTask(async () => {
        await this.$axios.post('products/delete', {
          id: product.id,
        });

        this.products = _.filter(this.products, (prod) => {
          return product.id !== prod.id;
        });

      }, 'Deleting...');
    }
  }
}
</script>

<style scoped>

</style>
