export default async(Game, keyInfo) => {
    if (!keyInfo.clicked) return;

    let getAroundTiles = () => {
        let playerX = Game.playerInfo.posX
        let playerY = Game.playerInfo.posY

        return {
            upTileId: Game.currentMap[playerY-1][playerX].id,
            downTileId: Game.currentMap[playerY+1][playerX].id,
            leftTileId: Game.currentMap[playerY][playerX-1].id,
            rightTileId: Game.currentMap[playerY][playerX+1].id,
            curTileId: Game.currentMap[playerY][playerX].id
        }
    }

    let autoMovePlayer = (direction, keyInput)  => {
        if (!direction) return

        if (getAroundTiles()[direction+'TileId'] != 1 && (!Game.playerInfo.inMovement && keyInput || !keyInput)) {
            Game.playerInfo.inMovement = true
            if (keyInput) Game.playerInfo.direction = direction

            switch (Game.playerInfo.direction) {
                case 'up':
                    Game.playerInfo.posY -= 1
                    break
                case 'down':
                    Game.playerInfo.posY += 1
                    break
                case 'left':
                    Game.playerInfo.posX -= 1
                    break
                case 'right':
                    Game.playerInfo.posX += 1
                    break
            }
            Game.playerInfo.moveCount += 1

            if (Game.playerInfo.nextDirection && getAroundTiles()[Game.playerInfo.nextDirection+'TileId'] != 1) {
                Game.playerInfo.inMovement = false
                Game.playerInfo.direction = Game.playerInfo.nextDirection
                Game.playerInfo.nextDirection = null
            } 
            
            setTimeout(() => autoMovePlayer(Game.playerInfo.direction), 1000/25)
        } else {
            if (Game.playerInfo.moveCount <= 0) Game.playerInfo.nextDirection = direction
            else if (keyInput) Game.playerInfo.nextDirection = direction
            if (!keyInput && Game.playerInfo.nextDirection != Game.playerInfo.direction) {
                Game.playerInfo.inMovement = false
                autoMovePlayer(Game.playerInfo.nextDirection, true)
                Game.playerInfo.direction = Game.playerInfo.nextDirection
                Game.playerInfo.nextDirection = null
            } else if (!keyInput) {
                Game.playerInfo.inMovement = false
                Game.playerInfo.nextDirection = null
                Game.playerInfo.direction = null
            }
            Game.playerInfo.moveCount = 0
            
        }

        if (getAroundTiles().curTileId != 0) {
            let playerX = Game.playerInfo.posX
            let playerY = Game.playerInfo.posY

            if (getAroundTiles().curTileId == 51) Game.PlaySong('specialCube.mp3', { newSong: true, volume: 0.1 })
            if (getAroundTiles().curTileId == 52 || getAroundTiles().curTileId == 53) Game.PlaySong('up+.mp3', { newSong: true, volume: 0.1 })
            Game.currentMap[playerY][playerX] = 0 
        }
    }
    
    if (keyInfo.code == 'KeyW') autoMovePlayer('up', true)
    if (keyInfo.code == 'KeyS') autoMovePlayer('down', true)
    if (keyInfo.code == 'KeyA') autoMovePlayer('left', true)
    if (keyInfo.code == 'KeyD') autoMovePlayer('right', true)
}