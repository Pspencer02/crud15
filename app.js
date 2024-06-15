document.addEventListener("DOMContentLoaded", () => {
    // Get references to HTML elements
    const characterUl = document.getElementById("characterUl"); // UL element to display characters
    const createForm = document.getElementById("createForm"); // Form to create characters

    // Function to fetch characters from the API and render them
    const fetchAndRenderCharacters = () => {
        // Fetch characters from the MockAPI endpoint
        fetch('https://6667be41f53957909ff520b9.mockapi.io/characters')
            .then(response => response.json()) // Parse response as JSON
            .then(characters => {
                // Clear the character list
                characterUl.innerHTML = "";
                // Loop through each character
                characters.forEach(character => {
                    // Create a list item element for the character
                    const li = document.createElement("li");
                    // Set the text content of the list item to the character name
                    li.textContent = character.name;
                    // Append the list item to the character list
                    characterUl.appendChild(li);

                    // Create a delete button for the character
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    // Add event listener to delete the character when the button is clicked
                    deleteButton.addEventListener("click", () => deleteCharacter(character.id));
                    // Append the delete button to the list item
                    li.appendChild(deleteButton);

                    // Create an update button for the character
                    const updateButton = document.createElement("button");
                    updateButton.textContent = "Update";
                    // Add event listener to show update form when the button is clicked
                    updateButton.addEventListener("click", () => showUpdateForm(character));
                    // Append the update button to the list item
                    li.appendChild(updateButton);
                });
            })
            .catch(error => console.error('Error fetching characters:', error));
    };

    // Function to create a character
    const createCharacter = (name) => {
        // Send a POST request to create a new character with the given name
        fetch('https://6667be41f53957909ff520b9.mockapi.io/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }), // Body contains the character data
        })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            console.log('Character created:', data);
            fetchAndRenderCharacters(); // Refresh the character list
        })
        .catch(error => console.error('Error creating character:', error));
    };

    // Function to delete a character
    const deleteCharacter = (id) => {
        // Send a DELETE request
        fetch(`https://6667be41f53957909ff520b9.mockapi.io/characters/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchAndRenderCharacters()) // Refresh the character list
        .catch(error => console.error('Error deleting character:', error));
    };

    // Function to show update form for a character
    const showUpdateForm = (character) => {
        // Create a form element for updating the character
        const updateForm = document.createElement("form");
        // Populate the form with input fields for the character's name
        updateForm.innerHTML = `
            <input type="text" id="updateName" value="${character.name}">
            <button type="button" id="updateButton">Update</button>
        `;
        // Add event listener to handle form submission
        updateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const updatedName = document.getElementById("updateName").value;
            updateCharacter(character.id, updatedName); // Update the character with the new name
        });
        // Append the update form to the character list
        characterUl.appendChild(updateForm);
    };

    // Function to update a character
    const updateCharacter = (id, name) => {
        // Send a PUT request to update the character's name
        fetch(`https://6667be41f53957909ff520b9.mockapi.io/characters/${id}`, {
            method: 'PUT', // or 'PATCH'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }), // Body contains the updated character data
        })
        .then(response => response.json()) 
        .then(data => {
            console.log('Character updated:', data);
            fetchAndRenderCharacters(); // Refresh the character list
        })
        .catch(error => console.error('Error updating character:', error));
    };

    // Event listener for create form submission
    createForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value; // Get the character name from the form
        createCharacter(name); // Create a new character with the given name
    });

    // Initial fetch and render characters when the page loads
    fetchAndRenderCharacters();
});
