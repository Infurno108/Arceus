#!/bin/bash

ps aux | grep 'java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.3.0/unix_args.txt' | grep -v grep