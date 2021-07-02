<template>
      <v-app>
    <div class="introWrapper" data-step="1">  
        <h1><router-link to="/">corona<br /><span>memories</span></router-link></h1>
        <h2>About this research</h2>
        <p>We are interested how people read and engage with different kinds of contextual information in data visualizations.<br>If you have comments or suggestions about this research please contact Tobias Kauer at T.Kauer@ed.ac.uk.</p>

        <h2>Participant Information Sheet</h2>
        <p>
            <strong>Project Title</strong>: Corona Memories<br />
            <strong>Principal Investigator</strong>: Dr. Benjamin Bach<br />
            <strong>Researchers</strong>: Tobias Kauer, Dr. Marian Dörk<br>
        </p>

    <p>This study was certified according to the Informatics Research Ethics Process, RT number 5766. Please take time to read the following information carefully. You should keep this page for your records.</p>
    <p><strong><em>Who are the researchers?</em></strong> The study is being conducted by Dr. Benjamin Bach and Tobias Kauer at the University of Edinburgh and Dr. Marian Dörk, University of Applied Sciences Potsdam.</p>
    <p><strong><em>What is the purpose of the study?</em></strong> This study aims to understand  how people read data visualizations and which stories they want to tell about the data in the visualization. 
    <p><strong><em>Why have I been asked to take part?</em></strong> You have visited the website https://coronamemories.tobiaskauer.org.<p>

    <p><strong><em>Do I have to take part?</em></strong> Your participation and use of the website is entirely voluntary and you may stop using it at any time and for any reason. Your rights will not be affected. If you wish to withdraw, contact Tobias Kauer (T.Kauer@ed.ac.uk) and state which comment you wish to remove. If you stop participating at any point, data collection will end, but data already collected will be retained in anonymous form. We will stop using your data in any publications or presentations submitted after you have withdrawn consent. However, we will keep copies of your original consent, and of your withdrawal request.</p>
    <p><strong><em>What will happen if I decide to take part? </em></strong>We will record your activity (timestamps and mouse events) on the website as well as collect your shared stories. If you decide to take part in the online survey, we will ask you about your experience viewing the visualization on the website mentioned above and may use your answers in future research publications. If you choose to submit a story to the website, we may use your submission in future research publications. </p>
    <p><strong><em>Are there any risks associated with taking part?</em></strong> There are no significant risks associated with participation. </p>
    <p><strong><em>Are there any benefits associated with taking part?</em></strong> You will support publicly funded research on creating interfaces for commenting on visualizations.</p>
    <p><strong><em>What will happen to the results of this study? </em></strong> The results of this study may be summarised in published scientific articles, reports and presentations. With your consent, short extracts of submitted stories and written feedback from the survey may be quoted in research papers to support key findings of  our research. Your data may be archived for a minimum of two years. None of the publications will provide any monetary benefit to the research team and we are happy to send you a copy of any publication that emerged out of our study.</p>
    <p><strong><em>WData protection and confidentiality.</em></strong> Your data will be processed in accordance with Data Protection Law. Your data will be referred to by a unique participant number rather than by name. Your data will only be viewed by the research team stated above. All electronic data will be stored on a password-protected encrypted computer, on the School of Informatics’ secure file servers, or on the University’s secure encrypted cloud storage services (DataShare, ownCloud, or Sharepoint).</p>
    <p><strong><em>What are my data protection rights?</em></strong> The University of Edinburgh is a Data Controller for the information you provide. You have the right to access information held about you. Your right of access can be exercised in accordance with the Data Protection Law. You also have other rights including rights of correction, erasure and objection. For more details, including the right to lodge a complaint with the Information Commissioner’s Office, please visit www.ico.org.uk. Questions, comments and requests about your personal data can also be sent to the University Data Protection Officer at dpo@ed.ac.uk. </p>
    <p><strong><em>Who can I contact?</em></strong> If you have any further questions about the study, please contact the lead researcher, Tobias Kauer at T.Kauer@ed.ac.uk. If you wish to make a complaint about the study, please contact inf-ethics@inf.ed.ac.uk. When you contact us, please provide the study title and detail the nature of your complaint.</p>
    <p><strong><em>Updated information.</em></strong> If the research project changes in any way, an updated Participant Information Sheet will be made available on https://web.inf.ed.ac.uk/infweb/research/study-updates.</p>
    <p><strong><em>Alternative formats</em></strong> To request this document in an alternative format, such as large print or on coloured paper, please contact Tobias Kauer at T.Kauer@ed.ac.uk.</p>
    <p><strong><em>General information.</em></strong> For general information about how we use your data, go to: edin.ac/privacy-research</p>
    </div>
    </v-app>
  </template>


<script>
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;900&display=swap');

h1{
  margin: 10px 0 10px 0px;
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
  font-size: 40px;

  line-height: 30px;

  
}

h1 a {
      color: #FA5E2D;
    text-decoration: none !important;   
}

.callToActionWrapper {
  position: fixed;
  top: 10px;
  right: 10px;
}

h1 span{
  font-weight: 900;
}

.introWrapper, .explorationWrapper, .animatorWrapper, .formWrapper {
  
  
  padding-top: 10px;
  padding: 40px 0px 50px 20px;
  
  position: relative;
  width: 50%;
  min-width: 300px;
}

#app {
  
  background: #FFEBC6;
  min-height: 100%;
}
  
  </style>
