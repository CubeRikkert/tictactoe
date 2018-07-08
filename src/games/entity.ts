import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, Length, IsJSON } from 'class-validator'

type Spot = 'x' | 'o'
type Row = [ Spot, Spot, Spot ]
type Board = [ Row, Row, Row ]

const defaultRow: Row = ['o', 'o', 'o']
export const defaultBoard: Board = [defaultRow, defaultRow, defaultRow]


export const colors = [ 'red', 'blue', 'green', 'yellow', 'magenta' ]
export const randomColor = () => {
  let randomNumber = Math.floor(Math.random()*5)
  let color = colors[randomNumber]
  return color
}

export const moves = (board1, board2) => 
  board1
    .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
    .reduce((a, b) => a.concat(b))
    .length


@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @Length(2, 25)
  @Column('text')
  name: string

  @IsString()
  @Column('enum', {enum: colors})
  color: string = randomColor()

  @IsJSON()
  @Column('json', {default: defaultBoard})
  board: Board
}