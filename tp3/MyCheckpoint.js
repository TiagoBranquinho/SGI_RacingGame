class MyCheckpoint {
    constructor(position) {
        this.position = position;
        this.reached = false;
    }

    // Method to check if the player has reached this checkpoint
    checkReached(playerPosition) {
        // You can adjust this distance as needed
        const reachDistance = 10;

        if (this.position.distanceTo(playerPosition) < reachDistance) {
            this.reached = true;
        }

        return this.reached;
    }
}

export { MyCheckpoint };
