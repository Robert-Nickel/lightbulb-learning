<script lang="ts">
    import { baseUrl } from '$lib/awsCommon';
    
        import { Auth } from 'aws-amplify';
    
        async function createGroup() {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
    
            const user = await Auth.currentAuthenticatedUser();
            const userName = user.attributes.email;
            // TODO: change this hardcoded userpool to be custom for premium instances
            const userPoolId = 'eu-central-1_bAc9VMMys';
    
            const groupName = document.getElementById('groupName').value;
            const body = {
                userName,
                userPoolId,
                groupName,
                roleType: "Free"
            };
    
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            };
    
            fetch(`${baseUrl}/createGroup`, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.log('error', error));
        }
    </script>
    
    <main class="container pt-4">
        <input id="groupName" placeholder="Group Name" />
        <button on:click={createGroup}>Create Group</button>
    </main>
    