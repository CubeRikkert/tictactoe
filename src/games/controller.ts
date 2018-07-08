import { JsonController, Get, Param, Put, Body, Post, HttpCode, NotFoundError, BadRequestError, BodyParam } from 'routing-controllers'
import Game from './entity'
import {colors, randomColor, moves, defaultBoard} from './entity'


@JsonController()
export default class GameController {

    @Get('/games/:id')
    getGame(
      @Param('id') id: number
    ) {
      return Game.findOne(id)
    }

    @Get('/games')
    async allGames() {
        const games = await Game.find()
        return { games }
    }

    @Put('/games/:id')
    async updateGame(
      @Param('id') id: number,
      @Body() update: Partial<Game>
    ) {
      const game = await Game.findOne(id)
      if (!game) throw new NotFoundError('Cannot find game')
      if (update.color) {
        if (!colors.includes(update.color)) throw new BadRequestError('not a valid color, pick red, blue, green, yellow or magenta')
      }
      if (update.board) {
        if (moves(game.board, update.board) >= 2) throw new BadRequestError('only one move per turn allowed')
      }
      return Game.merge(game, update).save()
    }

    @Post('/games')
    @HttpCode(201)
    createGame(
      @BodyParam('name') name: string
    ) {
      const newGame = new Game()

      newGame.name = name
      newGame.color = randomColor()
      newGame.board = defaultBoard

      return newGame.save()
    }

}