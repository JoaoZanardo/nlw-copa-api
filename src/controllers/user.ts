import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "src/repositories/interfaces/UserRepository";
import { z } from "zod";

export class UserController {
    constructor(private userRepository: UserRepository) { }

    async count(): Promise<number> {
        return await this.userRepository.count();
    }

    async create(req: FastifyRequest, app: FastifyInstance): Promise<string> {
        // const createUserBody = z.object({
        //     access_token: z.string()
        // });

        // const { access_token } = createUserBody.parse(req.body);

        // const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${access_token}`
        //     }
        // });

        // const userData = await userResponse.json();

        // const userInfoSchema = z.object({
        //     id: z.string(),
        //     email: z.string().email(),
        //     name: z.string(),
        //     picture: z.string().url()
        // });

        // const userInfo = userInfoSchema.parse(userData);

        let user = await this.userRepository.findOneByGoogleId('userInfo.id');
        if (!user) {
            user = await this.userRepository.create({
                googleId: 'userInfo.id',
                name: 'userInfo.name',
                email: 'userInfo.email',
                avatarUrl: 'userInfo.picture'
            });
        }

        const token = app.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl
        }, {
            sub: user.id,
            expiresIn: '7 days'
        })

        return token;
    }
}