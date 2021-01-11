<script>
  import ModalCard from '../components/ModalCard.svelte';
</script>

<ModalCard on:closeModal>
  <span slot="title">
    Login
  </span>
  <slot>
    <form action on:submit|preventDefault>
      <!-- Email Field -->
      <div class="field">
        <label for class="label">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            placeholder="e.g. bobsmith@gmail.com"
            class="input"
            required
            v-model="email"
          >
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </div>
      </div>
      <!-- Password Field -->
      <div class="field">
        <label for class="label">Password</label>
        <div class="control has-icons-left">
          <input
            v-model="password"
            type="password"
            placeholder="*******"
            class="input"
            required
          >
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </div>
      </div>
      <!-- Login Button -->
      <div class="field buttons">
        <button class="button is-info" :disabled="success">Login</button>
        <!-- Create New User Button -->
        <button class="button is-info" :disabled="success">Create New User</button>
      </div>
    </form>
    <!-- Invalid Credentials Box -->
    <div v-if="invalid" class="box is-invalid" key="invalid">
      <i class="fa fa-exclamation-triangle"></i>
      Invalid Credentials
    </div>
    <!-- Valid Credentials Box -->
    <div v-if="success" class="box is-valid" key="success">
      <i class="fa fa-check-circle"></i>
      Success!
    </div>
  </slot>
</ModalCard>