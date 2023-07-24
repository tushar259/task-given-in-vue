<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" :class="{'active': activeLink == 'step1'}" href="">Step 1</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{'active': activeLink == 'step2'}" href="">Step 2</a>
            </li>
        </ul>
        <div v-if="activeLink == 'step1'">
            <div style="height: 40px;"></div>
            <div class="form-group">
                <label>Project name</label>
                <input type="text" class="form-control" v-model="firstStepForm.projectName" placeholder="Project name">
            </div>
            <div class="form-group">
                <label>Project description</label>
                <input type="text" class="form-control" v-model="firstStepForm.projectDesc" placeholder="Project description">
            </div>
            <div class="form-group">
                <label>Client</label>
                <input type="text" class="form-control" v-model="firstStepForm.client" placeholder="Client">
            </div>
            <div class="form-group">
                <label>Contractor</label>
                <input type="text" class="form-control" v-model="firstStepForm.contractor" placeholder="Contractor">
            </div>
            <button type="button" class="btn btn-primary" @click="submitFisrtStep()">Next</button>
        </div>
        <div v-else-if="activeLink == 'step2'">
            <div style="height: 40px;"></div>
            
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                activeLink: 'step1',
                firstStepForm: {
                    projectName: localStorage.getItem("projectName"),
                    projectDesc: localStorage.getItem("projectDesc"),
                    client: localStorage.getItem("client"),
                    contractor: localStorage.getItem("contractor")
                }
            }
        },

        methods: {
            submitFisrtStep(){
                event.preventDefault();
                if(this.firstStepForm.projectName !== '' &&
                this.firstStepForm.projectDesc !== '' &&
                this.firstStepForm.client !== '' &&
                this.firstStepForm.contractor !== ''){
                    localStorage.setItem("projectName", this.firstStepForm.projectName);
                    localStorage.setItem("projectDesc", this.firstStepForm.projectDesc);
                    localStorage.setItem("client", this.firstStepForm.client);
                    localStorage.setItem("contractor", this.firstStepForm.contractor);
                    this.activeLink = 'step2';
                }
            }
        }
    }
</script>
