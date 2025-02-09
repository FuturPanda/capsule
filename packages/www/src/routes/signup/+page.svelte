<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle, Root } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { formSchema, type FormSchema } from './schema';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { FormButton, FormControl, FormField, FormLabel } from '$lib/components/ui/form/index';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import { Button } from '$lib/components/ui/button';
  import { EyeClosedIcon, EyeIcon, Mail } from 'lucide-svelte';
  import { fly } from 'svelte/transition';


  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } =
    $props();
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onSubmit: () => {
      isLoading = true;
    },
    onResult: () => {
      isLoading = false;
      isSecondScreen = true;
    },
  });
  const { form: formData, enhance, errors } = form;
  let isLoading = $state(false);
  let isSecondScreen = $state(false);


  let isOpen = $state(false);
  let showPassword = $state(false);
  let requirements = $state([
    { text: 'Uppercase Letter', regex: /[A-Z]/, met: false },
    { text: 'Lowercase Letter', regex: /[a-z]/, met: false },
    { text: 'Number', regex: /[0-9]/, met: false },
    { text: 'Special character (e.g !?<>@#*$%)', regex: /[!@#$%^&*(),.?":{}|<>]/, met: false },
    { text: '8 characters or more', regex: /.{8,}/, met: false },
  ]);

  function onPasswordClick() {
    isOpen = true;
  }


  function checkPassword() {
    requirements = requirements.map(req => ({
      ...req,
      met: req.regex.test($formData.password),
    }));
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

</script>
<svelte:head>
  <script async defer src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>
</svelte:head>
{#if !isSecondScreen}
  <div class="flex justify-center items-center w-screen h-screen">
    <Root class="outline-none border-none w-full max-w-md mx-4 ">
      <CardHeader>
        <CardTitle class="text-2xl">Get Started</CardTitle>
        <CardDescription>
          Create a new Capsule.
        </CardDescription>
      </CardHeader>
      <form method="POST" use:enhance>
        <CardContent>
          <FormField {form} name="email">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel>Email</FormLabel>
                <Input {...props} bind:value={$formData.email} />
                {#if $errors.email}
                  <p class="text-red-500 text-sm mt-1">{$errors.email[0]}</p>
                {/if}

              {/snippet}
            </FormControl>
          </FormField>
          <FormField {form} name="password">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel>Password</FormLabel>
                <div class="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...props}
                    bind:value={$formData.password}
                    onclick={onPasswordClick}
                    oninput={checkPassword}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    class="absolute right-0 top-0 h-full px-3 py-2"
                    onclick={togglePasswordVisibility}
                  >
                    {#if showPassword}
                      <EyeIcon class="h-4 w-4" />
                    {:else}
                      <EyeClosedIcon class="h-4 w-4" />
                    {/if}
                  </Button>
                </div>
                {#if $errors.password}
                  <p class="text-red-500 text-sm mt-1">{$errors.password[0]}</p>
                {/if}

              {/snippet}
            </FormControl>
          </FormField>
          {#if isOpen}
            {#each requirements as r}
              <li class=" flex items-center text-xs mt-2">
                <Checkbox class="m-1 w-3 h-3" checked={r.met}
                          disabled />
                <p class={r.met ? 'text-green-600' : 'text-gray-600'}>
                  {r.text}</p>
              </li>
            {/each}
          {/if}
          <FormField {form} name="cf-turnstile-response">
            <FormControl>
              {#snippet children()}
                <div
                  class="cf-turnstile mt-3 rounded-s"
                  data-sitekey="0x4AAAAAAA7oFhcbnoayUME5"
                  data-callback="javascriptCallback"
                  data-size="flexible"
                ></div>
              {/snippet}
            </FormControl>
          </FormField>
          <FormButton
            class="mt-5 w-full text-white transition-colors duration-200 bg-teal-700 enabled:hover:bg-teal-600 disabled:bg-teal-900 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            disabled={!$formData?.email || !$formData?.password}
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </div>
            {:else}
              Create Capsule
            {/if}
          </FormButton>
        </CardContent>
      </form>
    </Root>
  </div>

{:else}
  <div class="flex justify-center items-center min-h-screen p-4 bg-background">
    <div in:fly={{ y: 20, duration: 300, delay: 150 }} class="w-full max-w-md text-center">
      <Card class="border-none shadow-none bg-transparent">
        <CardHeader class="space-y-6">
          <div class="mx-auto">
            <Mail class="w-12 h-12 text-primary" />
          </div>
          <div class="space-y-4">
            <CardTitle class="text-3xl font-medium">Check your email</CardTitle>
            <p class="text-muted-foreground text-lg">
              We just sent a verification link to ${$formData.email}. Click on it to create your capsule.
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
{/if}
