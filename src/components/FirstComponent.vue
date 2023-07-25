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
            <div class="form-group">
                <label>Project name</label>
                <input type="text" class="form-control" v-model="firstStepForm.projectName" disabled>
            </div>
            <div class="form-group">
                <label>Project description</label>
                <input type="text" class="form-control" v-model="firstStepForm.projectDesc" disabled>
            </div>
            <div class="form-group">
                <label>Client</label>
                <input type="text" class="form-control" v-model="firstStepForm.client" disabled>
            </div>
            <div class="form-group">
                <label>Contractor</label>
                <input type="text" class="form-control" v-model="firstStepForm.contractor" disabled>
            </div>
            
            <input type="file" @change="handleFileUpload" accept=".csv" />
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
                            <td v-if="columnName != 'KP'"><input type="text" class="form-control" v-model="columnData.max" placeholder="Max value"></td>
                            <td v-if="columnName != 'KP'"><input type="text" class="form-control" v-model="columnData.min" placeholder="Min value"></td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
            <div>
                <canvas ref="chartCanvas"></canvas>
            </div>
            <div style="height: 40px;"></div>
            <div class="button-container">
                <button type="button" class="btn btn-secondary" @click="activeLink = 'step1'">Back</button>
                <button type="button" class="btn btn-primary" @click="submitSecondStep()">Next</button>
                <button @click="refreshPage()">Refresh Page</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { Chart, registerables } from 'chart.js';
    Chart.register(...registerables);
    export default{
        data(){
            return{
                activeLink: 'step1',
                firstStepForm: {
                    projectName: localStorage.getItem("projectName"),
                    projectDesc: localStorage.getItem("projectDesc"),
                    client: localStorage.getItem("client"),
                    contractor: localStorage.getItem("contractor"),
                    
                },
                csvData: [],
                maxMinValues: {
                    X: { max: '', min: '' },
                    Y: { max: '', min: '' },
                    Z: { max: '', min: '' },
                },
                chart: null,

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
            },

            handleFileUpload(event) {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const content = e.target.result;
                    const rows = content.split(/\r\n|\n/);
                    this.csvData = rows;
                    this.calculateMaxMinValues(rows);
                };

                reader.readAsText(file);
            },
            
            calculateMaxMinValues(rows) {
                const headerRow = rows.shift().split(',');
                const columnValues = {};

                headerRow.forEach((columnName) => {
                    columnValues[columnName] = {
                        max: Number.MIN_SAFE_INTEGER,
                        min: Number.MAX_SAFE_INTEGER,
                    };
                });

                rows.forEach((row) => {
                    const values = row.split(',');

                    headerRow.forEach((columnName, index) => {
                        const value = Number(values[index]);
                        if (!isNaN(value)) {
                            columnValues[columnName].max = Math.max(columnValues[columnName].max, value);
                            columnValues[columnName].min = Math.min(columnValues[columnName].min, value);
                        }
                    });
                });

                this.maxMinValues = columnValues;
            },

            submitSecondStep(){
                const maxMinValuesJson = JSON.stringify(this.maxMinValues);
                localStorage.setItem('maxMinValues', maxMinValuesJson);
                this.$router.push("/second-component");
            },

            createChart() {
                const chartCanvas = this.$refs.chartCanvas;
                const labels = this.csvData.map((row) => {
                    const values = row.split(',');
                    return values[0]; 
                });
                const data = this.csvData.map((row) => {
                    const values = row.split(',');
                    return values[1]; 
                });

                this.chart = new Chart(chartCanvas, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'X Values',
                                data: data,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            },

            refreshPage() {
                window.location.reload();
            },
        },

        watch: {
            csvData() {
                if (this.csvData.length > 0) {
                    this.createChart();
                }
            },
        },
    }
</script>
