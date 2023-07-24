<template>
    <div>

        <button type="button" class="btn btn-secondary" @click="goToBack()">Back</button>
        <div class="download-button">
            <button type="button" class="btn btn-primary" @click="downloadAsPdf">Download as PDF</button>
        </div>
        <div id="pdf-content">
            <span>Project Name: <strong>{{firstStepForm.projectName}}</strong></span><br>
            <span>Project Description: <strong>{{firstStepForm.projectDesc}}</strong></span><br>
            <span>client: <strong>{{firstStepForm.client}}</strong></span><br>
            <span>contractor: <strong>{{firstStepForm.contractor}}</strong></span>
            <div style="height: 30px;"></div>
            <div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Column</th>
                            <th>Max value</th>
                            <th>Min value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(columnData, columnName) in maxMinValues" :key="columnName">
                            <td v-if="columnName != 'KP'">{{columnName}}</td>
                            <td v-if="columnName != 'KP'">{{columnData.max}}</td>
                            <td v-if="columnName != 'KP'">{{columnData.min}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import html2pdf from 'html2pdf.js';
    export default{
        data(){
            return{
                firstStepForm: {
                    projectName: localStorage.getItem("projectName"),
                    projectDesc: localStorage.getItem("projectDesc"),
                    client: localStorage.getItem("client"),
                    contractor: localStorage.getItem("contractor"),
                    
                },
                maxMinValues: []
            }
        },

        created(){
            const maxMinValuesJson = localStorage.getItem('maxMinValues');
            this.maxMinValues = JSON.parse(maxMinValuesJson) || [];
            console.log("maxMinValues: ", this.maxMinValues);
        },

        methods: {
            downloadAsPdf() {
                const content = document.getElementById('pdf-content');

                const options = {
                    margin: 10,
                    filename: 'template.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().from(content).set(options).save();
            },

            goToBack(){
                this.$router.push("/");
            }
        }

    }
</script>
