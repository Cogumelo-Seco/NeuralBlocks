export default async function Start(Game) {
    let newMap = []
    let bots = []
    let mapSize = 100
    let amountOfBots = 25
    let startGamePos = {}
    let endGamePos = {}
    let randomCenter = {
        x: Math.floor(Math.random() * (mapSize-10))+5,
        y: Math.floor(Math.random() * (mapSize-10))+5
    }

    for (let tileY = 0;tileY < mapSize;tileY++) {
        newMap.push([])
        for (let tileX = 0;tileX < mapSize;tileX++) {
            newMap[tileY].push({ id: 1, distanceOfCenter: (Math.abs(Math.floor(tileY-randomCenter.y)))+(Math.abs(Math.floor(tileX-randomCenter.x))) })
            /*if (tileY == 0 || tileY == mapSize-1 || tileX == 0 || tileX == mapSize-1)*/ 
            //else newMap[tileY].push({ id: 0, distanceOfCenter: (Math.abs(Math.floor(tileY-mapSize/2)))+(Math.abs(Math.floor(tileX-mapSize/2))) })
        }
    }


    for (let botId = 0;botId < amountOfBots;botId++) {
        let x = Math.floor(Math.random() * (mapSize-4))+2
        let y = Math.floor(Math.random() * (mapSize-4))+2

        if (botId == 0) startGamePos = { x, y }
        if (botId == 1) endGamePos = { x, y }

        bots.push({
            x,
            y,
            id: botId,
            direction: Math.floor(Math.random() * 3)+1,
            intelligence: 75,//Math.floor(Math.random() * 25)+25,
            dead: false
        })

        newMap[y][x].id = 0
    }

    let filtredTimes = 0
    let clearMap = () => {
        let tilesToChangeId = []
        
        for (let tileY = 0;tileY < mapSize;tileY++) {
            for (let tileX = 0;tileX < mapSize;tileX++) {
                let emptyTileAround = []

                if (newMap[tileY-1] && newMap[tileY-1][tileX].id != 1) emptyTileAround.push(1)
                if (newMap[tileY+1] && newMap[tileY+1][tileX].id != 1) emptyTileAround.push(2)
                if (newMap[tileY][tileX-1] && newMap[tileY][tileX-1]?.id != 1) emptyTileAround.push(3)
                if (newMap[tileY][tileX+1] && newMap[tileY][tileX+1]?.id != 1) emptyTileAround.push(4)


                if (emptyTileAround.length <= 0 && !tilesToChangeId[tileY+'-'+tileX]) tilesToChangeId[tileY+'-'+tileX] = { tileY, tileX, id: 0 }
            }
        }

        for (let i in tilesToChangeId) newMap[tilesToChangeId[i].tileY][tilesToChangeId[i].tileX].id = tilesToChangeId[i].id

        //newMap[endGamePos.y][endGamePos.x].id = 50
        Game.playerInfo.posX = startGamePos.x
        Game.playerInfo.posY = startGamePos.y
    }

    let moveBots = () => {
        for (let bot of bots) {
            if (bot.dead) continue
            
            let bestDirectioin = 1
            let directions = []
            if (newMap[bot.y-2] /*&& !botsTraces.find(t => t.x == bot.x && t.y == bot.y-1)*/) directions.push({ direction: 1, distanceOfCenter: newMap[bot.y-1][bot.x].distanceOfCenter })
            if (newMap[bot.y+2] /*&& !botsTraces.find(t => t.x == bot.x && t.y == bot.y+1)*/) directions.push({ direction: 2, distanceOfCenter: newMap[bot.y+1][bot.x].distanceOfCenter })
            if (newMap[bot.y][bot.x-2] /*&& !botsTraces.find(t => t.x-1 == bot.x && t.y == bot.y)*/) directions.push({ direction: 3, distanceOfCenter: newMap[bot.y][bot.x-1].distanceOfCenter })
            if (newMap[bot.y][bot.x+2] /*&& !botsTraces.find(t => t.x+1 == bot.x && t.y == bot.y)*/) directions.push({ direction: 4, distanceOfCenter: newMap[bot.y][bot.x+1].distanceOfCenter })

            for (let i = directions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [directions[i], directions[j]] = [directions[j], directions[i]]; // Intercambio (swap)
            }
            directions = directions.sort((a, b) => a.distanceOfCenter-b.distanceOfCenter)
            bestDirectioin = directions[0].direction
            //console.log(Math.floor(Math.random() * 2))

            if (Math.floor(Math.random()*100) <= bot.intelligence) bot.direction = bestDirectioin
            else bot.direction = directions[Math.floor(Math.random() * (directions.length-1))].direction
            //let newBotDirection = Math.floor(Math.random() * 100) <= bot.changeOfMovementPercent ? Math.floor(Math.random() * 3) : bot.direction
            
            if (bot.direction == 1) bot.y -= 1
            if (bot.direction == 2) bot.y += 1
            if (bot.direction == 3) bot.x -= 1
            if (bot.direction == 4) bot.x += 1

            if (newMap[bot.y][bot.x].distanceOfCenter <= 0) bot.dead = true
            if (newMap[bot.y][bot.x].id == 1) newMap[bot.y][bot.x].id = Math.floor(Math.random() * 100) <= 25 ? 51 : 0
            //bot.direction = newBotDirection
        }

        if (bots.find(b => b.dead == false)) setTimeout(moveBots, 1000/30)
        else clearMap()
    }
    moveBots()

    Game.bots = bots
    Game.currentMap = newMap
}